import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ConnectionRequest } from './connection-request.schema';
import { User } from 'src/user/user.schema';

@Injectable()
export class ConnectionRequestService {
    constructor(
        @InjectModel(ConnectionRequest.name) private connectionRequestModel: Model<ConnectionRequest>,
        @InjectModel(User.name) private userModel: Model<User>,
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
        const sender = await this.userModel.findById(senderId);
        if (sender.connections && sender.connections.includes(receiverId)) {
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
            { $addToSet: { connections: receiver } }
        );

        await this.userModel.updateOne(
            { _id: receiver },
            { $addToSet: { connections: sender } }
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

    async connectionRequestDeletion(
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
            { $pull: { connections: userId2 } }
        );

        await this.userModel.updateOne(
            { _id: userId2 },
            { $pull: { connections: userId1 } }
        );

        const user1Info = await this.userModel.findById(userId1).select('-password -__v').exec();
        const user2Info = await this.userModel.findById(userId2).select('-password -__v').exec();

        return {
            user1Info,
            user2Info
        };
    }
}
