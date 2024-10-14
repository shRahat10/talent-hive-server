import { Module } from '@nestjs/common';
import { ConnectionRequestService } from './connection-request.service';
import { ConnectionRequestController } from './connection-request.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ConnectionRequest, ConnectionRequestSchema } from './connection-request.schema';
import { User, UserSchema } from 'src/user/user.schema';
import { Connection, ConnectionSchema } from 'src/connection/connection.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ConnectionRequest.name, schema: ConnectionRequestSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Connection.name, schema: ConnectionSchema }])
  ],
  providers: [ConnectionRequestService],
  controllers: [ConnectionRequestController]
})
export class ConnectionRequestModule { }
