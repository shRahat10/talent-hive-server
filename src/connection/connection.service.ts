import { Injectable, NotFoundException } from '@nestjs/common';
import { Connection } from './connection.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ConnectionDto } from './dto/connection.dto';

@Injectable()
export class ConnectionService {
    constructor(
        @InjectModel(Connection.name) private connectionModel: Model<Connection>,
    ) { }

    // Check if two users are connected
    async checkIfConnected(userId1: Types.ObjectId, userId2: Types.ObjectId): Promise<boolean> {
        const userConnections = await this.connectionModel.findOne({ userId: userId1 });
        if (!userConnections) return false;
        return userConnections.connectedUserIds.includes(userId2);
    }

    async getConnections(userId: Types.ObjectId): Promise<Connection> {
        const connection = await this.connectionModel.findOne({ userId });
        if (!connection) throw new NotFoundException('User connections not found.');
        return connection;
    }

    async createConnection(connectionDto: ConnectionDto): Promise<Connection> {
        const { userId } = connectionDto;
        return await new this.connectionModel({ userId, connectedUserIds: [] }).save();
    }

    async addConnection(connectionDto: ConnectionDto): Promise<Connection> {
        const { userId, connectedUserIds } = connectionDto;
        const connection = await this.connectionModel.findOneAndUpdate(
            { userId },
            { $addToSet: { connectedUserIds: { $each: connectedUserIds || [] } } },
            { new: true, upsert: true }
        );
        return connection;
    }

    async removeConnection(userId: Types.ObjectId, connectedUserId: Types.ObjectId): Promise<Connection> {
        const connection = await this.connectionModel.findOneAndUpdate(
            { userId },
            { $pull: { connectedUserIds: connectedUserId } },
            { new: true }
        );
        if (!connection) throw new NotFoundException('User connections not found.');
        return connection;
    }
}
