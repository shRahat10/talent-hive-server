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
import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [
    // MongooseModule.forRoot(
    //   process.env.MONGO_URI,
    //   { dbName: 'Property' }
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
