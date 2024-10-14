import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { Types } from 'mongoose';
import { ConnectionService } from './connection.service';
import { ConnectionDto } from './dto/connection.dto';

@Controller('connection')
export class ConnectionController {
    constructor(private readonly connectionService: ConnectionService) { }

    @Get(':userId')
    async getConnection(@Param('userId') userId: string) {
        return this.connectionService.getConnections(new Types.ObjectId(userId));
    }

    @Patch('add')
    async addConnection(
        @Body() connectionDto: ConnectionDto
    ) {
        return this.connectionService.addConnection(connectionDto);
    }

    @Patch('remove')
    async removeConnection(
        @Body('userId') userId: string,
        @Body('connectedUserId') connectedUserId: string
    ) {
        return this.connectionService.removeConnection(
            new Types.ObjectId(userId),
            new Types.ObjectId(connectedUserId)
        );
    }
}
