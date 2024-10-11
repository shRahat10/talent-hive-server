import { Body, Controller, Delete, Get, Param, Post, Patch } from '@nestjs/common';
import { ConnectionRequestService } from './connection-request.service';
import { Types } from 'mongoose';
import { CreateConnectionRequestDto } from './dto/connection-request.dto';

@Controller('connection-request')
export class ConnectionRequestController {
    constructor(private readonly connectionRequestService: ConnectionRequestService) { }

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
    @Patch('accept/:id')
    async acceptConnectionRequest(@Param('id') id: string) {
        return this.connectionRequestService.acceptConnectionRequest(new Types.ObjectId(id));
    }

    // Handle both rejecting and deleting a connection request
    @Delete(':action/:id/:userId')
    async connectionRequestDeletion(
        @Param('action') action: 'reject' | 'delete',
        @Param('id') id: string,
        @Param('userId') userId: string,
    ) {
        return this.connectionRequestService.connectionRequestDeletion(
            new Types.ObjectId(id),
            new Types.ObjectId(userId),
            action,
        );
    }

    // Remove an existing connection between two users
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
