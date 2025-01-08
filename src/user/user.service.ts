import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';
import { IUser } from './interface/user.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<IUser>,
  ) {}

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async login(body: LoginUserDto) {
    const { email, password, roles } = body;

    if (!email || !password) {
      throw new Error('Invalid email or password');
    }

    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new Error('User not exist!');
    }

    if (!user.isPasswordCorrect(password)) {
      throw new Error('Invalid credentials');
    }

    return `This action logs a user in`;
  }
}