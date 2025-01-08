import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { ROLES } from '../enum/user-enum.types';
import { IUser } from '../interface/user.interface';
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export type UserDocument = User & Document;

@Schema({
  timestamps: true,
  versionKey: false,
  toJSON: {
    transform: (doc, ret) => {
      delete ret.password;
      delete ret.refreshTokens;

      if (ret.roles !== ROLES.RESEARCHER) {
        delete ret.isApproved;
      }

      return ret;
    },
  },
})
export class User {
  @Prop()
  name: string;
  @Prop()
  email: string;
  @Prop()
  password: string;
  @Prop({ default: Date.now })
  createdAt: Date;
  @Prop({ default: Date.now })
  updatedAt: Date;
  // Add other fields as needed
  roles: [{ type: mongoose.Schema.Types.ObjectId; ref: 'Role' }];
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre<IUser>('save', async function (next) {
  try {
    const saltRounds = Number(process.env.SALT_ROUNDS) || 10;

    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, saltRounds);

    next();
  } catch (error) {
    throw new Error(`User creation failed! ${error}`);
  }
});

UserSchema.methods.isPasswordCorrect = async function (
  this: IUser,
  password: string,
) {
  return await bcrypt.compare(password, this.password);
};

UserSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      name: this.name,
    },
    process.env.ACCESS_TOKEN_SECRET as string,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY },
  );
};

UserSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET as string,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY },
  );
};

UserSchema.set('toJSON', {
  transform: (doc, ret) => {
    // Remove sensitive fields like password and tokens from the response
    delete ret.password;
    delete ret.refreshTokens;

    // Conditionally include `isApproved`
    if (ret.roles !== ROLES.RESEARCHER) {
      delete ret.isApproved;
    }

    return ret;
  },
});

UserSchema.set('toObject', {
  transform: (doc, ret) => {
    // Remove sensitive fields like password and tokens from the response
    delete ret.password;
    delete ret.refreshTokens;

    // Conditionally include `isApproved`
    if (ret.roles !== ROLES.RESEARCHER) {
      delete ret.isApproved;
    }

    return ret;
  },
});
