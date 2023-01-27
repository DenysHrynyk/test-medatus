import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { UsersModule } from "./users/users.module"
import { AuthModule } from './auth/auth.module';


@Module({
  imports: [UsersModule, AuthModule, MongooseModule.forRoot(
    //database url string
  'mongodb+srv://admin:admin@cluster0.or363.mongodb.net/?retryWrites=true&w=majority'    )],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
  // 'mongodb+srv://admin:123456@cluster0.or363.mongodb.net/?retryWrites=true&w=majority'