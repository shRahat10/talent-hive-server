import { Module } from '@nestjs/common';
import { ConnectionRequestService } from './connection-request.service';
import { ConnectionRequestController } from './connection-request.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ConnectionRequest, ConnectionRequestSchema } from './connection-request.schema';
import { User, UserSchema } from 'src/user/user.schema';
import { Connection, ConnectionSchema } from 'src/connection/connection.schema';
import { ConnectionService } from 'src/connection/connection.service';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ConnectionRequest.name, schema: ConnectionRequestSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Connection.name, schema: ConnectionSchema }]),
    NotificationModule,
  ],
  providers: [ConnectionRequestService, ConnectionService],
  controllers: [ConnectionRequestController]
})
export class ConnectionRequestModule { }
