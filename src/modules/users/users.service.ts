import { UserCreationDTO } from './dto/userCreation.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import ErrorConstants from 'src/constants/error.constants';
import { hash } from 'bcryptjs';
import { User, UserDocument } from './schema/users.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserLastNameUpdateDTO } from './dto/userLastNameUpdate.dto';
import { UserFirstNameUpdateDTO } from './dto/userFirstNameUpdate.dto';
import PatternService from 'src/services/PatternService';
import { UserPasswordUpdateDTO } from './dto/userPasswordUpdate.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(userDto: UserCreationDTO): Promise<UserDocument> {
    const { email, firstName, lastName, password, username } = userDto;

    if (!PatternService.isEmailValid(email)) {
      throw new HttpException(ErrorConstants.INVALID_EMAIL, HttpStatus.BAD_REQUEST);
    }

    if (!PatternService.isNameValid(firstName) || !PatternService.isNameValid(lastName)) {
      throw new HttpException(ErrorConstants.INVALID_NAME, HttpStatus.BAD_REQUEST);
    }

    if (PatternService.isPasswordWeak(password)) {
      throw new HttpException(ErrorConstants.WEAK_PASSWORD, HttpStatus.BAD_REQUEST);
    }
    const existingWithEmail = await this.userModel.findOne({ email });

    if (existingWithEmail) {
      throw new HttpException(ErrorConstants.EMAIL_TAKEN, HttpStatus.BAD_REQUEST);
    }
    const existingWithUsername = await this.userModel.findOne({ username });

    if (existingWithUsername) {
      throw new HttpException(ErrorConstants.USERNAME_TAKEN, HttpStatus.BAD_REQUEST);
    }
    const newUser = new this.userModel(userDto);
    const hashedPassword = await hash(password, 12);
    newUser.password = hashedPassword;
    return newUser.save();
  }

  async getLoggedUserInfo(userId: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ _id: userId }).exec();
    if (!user) {
      throw new HttpException(ErrorConstants.BAD_REQUEST, HttpStatus.NOT_FOUND);
    }
    const response = user;
    return response;
  }

  async updateFirstName(userId: string, { firstName }: UserFirstNameUpdateDTO): Promise<UserDocument> {
    const user = await this.userModel.findOne({ _id: userId }).exec();
    if (!user) {
      throw new HttpException(ErrorConstants.BAD_REQUEST, HttpStatus.NOT_FOUND);
    }
    if (!PatternService.isNameValid(firstName)) {
      throw new HttpException(ErrorConstants.INVALID_NAME, HttpStatus.BAD_REQUEST);
    }
    user.firstName = firstName;
    return user.save();
  }

  async updateLastName(userId: string, { lastName }: UserLastNameUpdateDTO): Promise<UserDocument> {
    const user = await this.userModel.findOne({ _id: userId }).exec();
    if (!user) {
      throw new HttpException(ErrorConstants.BAD_REQUEST, HttpStatus.NOT_FOUND);
    }
    if (!PatternService.isNameValid(lastName)) {
      throw new HttpException(ErrorConstants.INVALID_NAME, HttpStatus.BAD_REQUEST);
    }
    user.lastName = lastName;
    return user.save();
  }

  async updateUserPassword(userId: string, { password }: UserPasswordUpdateDTO): Promise<UserDocument> {
    const user = await this.userModel.findOne({ _id: userId }).exec();

    if (PatternService.isPasswordWeak(password)) {
      throw new HttpException(ErrorConstants.WEAK_PASSWORD, HttpStatus.BAD_REQUEST);
    }
    const hashedPassword = await hash(password, 12);
    user.password = hashedPassword;
    user.tokenVersion++;
    return user.save();
  }

  async getByEmail(email: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new HttpException(ErrorConstants.BAD_CREDENTIALS, HttpStatus.BAD_REQUEST);
    }

    return user;
  }
}
