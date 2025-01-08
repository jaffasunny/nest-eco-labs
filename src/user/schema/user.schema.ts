import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { ROLES } from '../enum/user-enum.types';

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
