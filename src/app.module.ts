import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PostModule } from './post/post.module';
import { LikeCommentModule } from './like-comment-share/like-comment-share.module';
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
    LikeCommentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
