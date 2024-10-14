import { Module } from '@nestjs/common';
import { ConnectionController } from './connection.controller';
import { ConnectionService } from './connection.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Connection, ConnectionSchema } from './connection.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Connection.name, schema: ConnectionSchema }])
  ],
  controllers: [ConnectionController],
  providers: [ConnectionService]
})
export class ConnectionModule {}
