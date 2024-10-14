import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ConnectionRequest } from './connection-request.schema';
import { User } from 'src/user/user.schema';
import { Connection } from 'src/connection/connection.schema';

@Injectable()
export class ConnectionRequestService {
    constructor(
        @InjectModel(ConnectionRequest.name) private connectionRequestModel: Model<ConnectionRequest>,
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(Connection.name) private connectionModel: Model<Connection>,
    ) { }

    async getPendingRequests(userId: Types.ObjectId): Promise<ConnectionRequest[]> {
        return this.connectionRequestModel
            .find({ receiver: userId, status: 'pending' })
            .populate('sender', 'fullName userName email profileImage');
    }

    async getSentRequests(userId: Types.ObjectId): Promise<ConnectionRequest[]> {
        return this.connectionRequestModel
            .find({ sender: userId, status: 'pending' })
            .populate('receiver', 'fullName userName email profileImage');
    }

    async createConnectionRequest(senderId: Types.ObjectId, receiverId: Types.ObjectId): Promise<ConnectionRequest> {
        // Prevent users from sending connection requests to themselves
        if (senderId.equals(receiverId)) {
            throw new BadRequestException('You cannot send a connection request to yourself.');
        }

        // Check if users are already connected
        const senderConnections = await this.connectionModel.findOne({ userId: senderId });
        if (senderConnections && senderConnections.connectedUserIds.includes(receiverId)) {
            throw new BadRequestException('You are already connected with this user.');
        }

        // Check if a pending connection request already exists from sender to receiver
        const existingRequest = await this.connectionRequestModel.findOne({
            sender: senderId,
            receiver: receiverId,
            status: 'pending',
        });
        if (existingRequest) {
            throw new BadRequestException('You have already sent a connection request to this user.');
        }

        // Check if receiver has already sent a request to sender
        const reverseRequest = await this.connectionRequestModel.findOne({
            sender: receiverId,
            receiver: senderId,
            status: 'pending',
        });
        if (reverseRequest) {
            throw new BadRequestException('This user has already sent you a connection request.');
        }

        // Create a new connection request
        const newConnectionRequest = new this.connectionRequestModel({
            sender: senderId,
            receiver: receiverId,
            status: 'pending',
        });

        return await newConnectionRequest.save();
    }

    async acceptConnectionRequest(connectionRequestId: Types.ObjectId): Promise<{
        message: string,
        deletedRequestId: Types.ObjectId,
        senderInfo: User,
        receiverInfo: User
    }> {
        const connectionRequest = await this.connectionRequestModel.findById(connectionRequestId);
        if (!connectionRequest) {
            throw new NotFoundException('Connection request not found.');
        }

        if (connectionRequest.status !== 'pending') {
            throw new BadRequestException('This connection request has already been processed.');
        }

        const { sender, receiver } = connectionRequest;

        await this.userModel.updateOne(
            { _id: sender },
            { $inc: { connectionsCount: 1 } }
        );

        await this.userModel.updateOne(
            { _id: receiver },
            { $inc: { connectionsCount: 1 } }
        );

        // Add each user to the other's connection list
        await this.connectionModel.updateOne(
            { userId: sender },
            { $addToSet: { connectedUserIds: receiver } },
            { upsert: true }
        );
        await this.connectionModel.updateOne(
            { userId: receiver },
            { $addToSet: { connectedUserIds: sender } },
            { upsert: true }
        );

        const senderInfo = await this.userModel.findById(sender).select('-password -__v').exec();
        const receiverInfo = await this.userModel.findById(receiver).select('-password -__v').exec();

        await this.connectionRequestModel.findByIdAndDelete(connectionRequestId);

        return {
            message: 'Connection request accepted. You are now connected.',
            deletedRequestId: connectionRequestId,
            senderInfo,
            receiverInfo
        };
    }

    async deleteConnectionRequest(
        connectionRequestId: Types.ObjectId,
        userId: Types.ObjectId,
        action: 'reject' | 'delete'
    ): Promise<{ message: string; deletedRequestId: Types.ObjectId }> {
        const connectionRequest = await this.connectionRequestModel.findById(connectionRequestId);
        if (!connectionRequest) {
            throw new NotFoundException('Connection request not found.');
        }

        const { sender, receiver } = connectionRequest;

        if (!sender.equals(userId) && !receiver.equals(userId)) {
            throw new BadRequestException(`You are not authorized to ${action} this connection request.`);
        }

        await this.connectionRequestModel.findByIdAndDelete(connectionRequestId);

        return {
            message: `Connection request ${action} successfully.`,
            deletedRequestId: connectionRequestId
        };
    }

    async removeConnection(userId1: Types.ObjectId, userId2: Types.ObjectId): Promise<{
        user1Info: User,
        user2Info: User
    }> {
        await this.userModel.updateOne(
            { _id: userId1 },
            { $inc: { connectionsCount: -1 } }
        );

        await this.userModel.updateOne(
            { _id: userId2 },
            { $inc: { connectionsCount: -1 } }
        );

        // Remove each user from the other's connection list
        await this.connectionModel.updateOne(
            { userId: userId1 },
            { $pull: { connectedUserIds: userId2 } }
        );
        await this.connectionModel.updateOne(
            { userId: userId2 },
            { $pull: { connectedUserIds: userId1 } }
        );

        const user1Info = await this.userModel.findById(userId1).select('-password -__v').exec();
        const user2Info = await this.userModel.findById(userId2).select('-password -__v').exec();

        return {
            user1Info,
            user2Info
        };
    }
}
