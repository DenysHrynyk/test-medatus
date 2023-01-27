import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './users.model';
import {  NotAcceptableException } from '@nestjs/common';

@Injectable()
export class UsersService {
    constructor(@InjectModel('user') private readonly userModel: Model<User>) { }
    
    async insertUser(userName: string, password: string) {

        const username = userName.toLowerCase();

        const emailRegex = new RegExp(/^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/, "gm");
        var passwordRegex = new RegExp(/^(\S)(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹])[a-zA-Z0-9~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹]{8,64}$/);

        const isValidEmail = emailRegex.test(username);

        if (!isValidEmail) {
            throw new NotAcceptableException(' email is not valid');
        }

        const isStrongPassword = passwordRegex.test(password)

        if (!isStrongPassword) {
            throw new NotAcceptableException(' password is not valid');
        }
        const newUser = new this.userModel({
            username,
            password,
        });
        await newUser.save();
        return newUser;

    }
    async getUser(userName: string) {
        if (!userName) {
            throw new NotAcceptableException(' userName is wrong');
        }
        const username = userName.toLowerCase();
        const user = await this.userModel.findOne({ username });
        return user;
    }

    async updateUser(user_id: string, newPassword: string) {

        var passwordRegex = new RegExp(/^(\S)(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹])[a-zA-Z0-9~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹]{8,64}$/);

        const isStrongPassword = passwordRegex.test(newPassword)

        if (!isStrongPassword) {
            throw new NotAcceptableException(' password is not valid');
        }

        const updatePassword = await this.userModel.updateOne({ "_id": user_id }, {
            "password": newPassword,
        })
        return updatePassword;
    }
}