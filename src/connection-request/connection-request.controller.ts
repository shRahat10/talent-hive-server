import { Body, Controller, Delete, Get, Param, Post, Patch } from '@nestjs/common';
import { ConnectionRequestService } from './connection-request.service';
import { Types } from 'mongoose';
import { CreateConnectionRequestDto } from './dto/connection-request.dto';
import { ConnectionService } from 'src/connection/connection.service';

@Controller('connection-request')
export class ConnectionRequestController {
    constructor(
        private readonly connectionRequestService: ConnectionRequestService,
        private readonly connectionService: ConnectionService,
    ) { }

    // Check if two users are connected, sent request, or received request
    @Post('check-status')
    async checkConnectionStatus(
        @Body('loggedInUserId') loggedInUserId: string,
        @Body('userIds') userIds: string[],
    ) {
        const loggedInUserObjId = new Types.ObjectId(loggedInUserId);

        const results = await Promise.all(userIds.map(async (userId) => {
            const userObjId = new Types.ObjectId(userId);

            const areConnected = await this.connectionService.checkIfConnected(loggedInUserObjId, userObjId);
            const hasSentRequest = await this.connectionRequestService.hasSentRequest(loggedInUserObjId, userObjId);
            const hasReceivedRequest = await this.connectionRequestService.hasReceivedRequest(loggedInUserObjId, userObjId);

            let status = 'no_relationship';
            if (areConnected) {
                status = 'connected';
            }
            else if (hasSentRequest) {
                status = 'request_sent';
            }
            else if (hasReceivedRequest) {
                status = 'request_received';
            }

            return {
                userId,
                status,
            };
        }));

        return results;
    }

    @Get('pending/:userId')
    async getPendingRequests(@Param('userId') userId: string) {
        return this.connectionRequestService.getPendingRequests(new Types.ObjectId(userId));
    }

    @Get('sent/:userId')
    async getSentRequests(@Param('userId') userId: string) {
        return this.connectionRequestService.getSentRequests(new Types.ObjectId(userId));
    }

    // Create a new connection request
    @Post()
    async createConnectionRequest(@Body() createConnectionRequestDto: CreateConnectionRequestDto) {
        const { sender, receiver } = createConnectionRequestDto;
        return this.connectionRequestService.createConnectionRequest(
            new Types.ObjectId(sender),
            new Types.ObjectId(receiver),
        );
    }

    // Accept a connection request
    @Patch('accept/:userId/:otherUserId')
    async acceptConnectionRequest(
        @Param('userId') userId: string,
        @Param('otherUserId') otherUserId: string
    ) {
        return this.connectionRequestService.acceptConnectionRequest(
            new Types.ObjectId(userId),
            new Types.ObjectId(otherUserId)
        );
    }

    // Handle both rejecting and deleting a connection request
    @Delete(':action/:userId/:otherUserId')
    async deleteConnectionRequest(
        @Param('action') action: 'reject' | 'delete',
        @Param('userId') userId: string,
        @Param('otherUserId') otherUserId: string,
    ) {
        return this.connectionRequestService.deleteConnectionRequest(
            new Types.ObjectId(userId),
            new Types.ObjectId(otherUserId),
            action
        );
    }

    // Remove an existing connection between two users after accepting
    @Delete(':userId1/:userId2')
    async removeConnection(
        @Param('userId1') userId1: string,
        @Param('userId2') userId2: string,
    ) {
        return this.connectionRequestService.removeConnection(
            new Types.ObjectId(userId1),
            new Types.ObjectId(userId2)
        );
    }
}
