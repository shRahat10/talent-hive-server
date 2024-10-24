import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PostModule } from './post/post.module';
import { UserModule } from './user/user.module';
import { PostInteractionModule } from './post-interaction/post-interaction.module';
import { CompanyModule } from './company/company.module';
import { JobPostModule } from './job-post/job-post.module';
import { ConnectionRequestModule } from './connection-request/connection-request.module';
import { ConnectionModule } from './connection/connection.module';
import * as dotenv from 'dotenv';
import { CompanyFollowersModule } from './company-followers/company-followers.module';
import { NotificationModule } from './notification/notification.module';
dotenv.config();

@Module({
  imports: [
    // MongooseModule.forRoot(
    //   process.env.MONGO_URI,
    //   { dbName: '' }
    // ),

    ConfigModule.forRoot({
      isGlobal: true, // Makes the ConfigModule available globally
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),
    PostModule,
    UserModule,
    PostInteractionModule,
    CompanyModule,
    JobPostModule,
    ConnectionRequestModule,
    ConnectionModule,
    CompanyFollowersModule,
    NotificationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
