import mongoose, { Schema } from "mongoose";
import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt";

    const subscriptionSchema = new Schema({
        subscriber: {
          type: Schema.Types.ObjectId, // one who is subscriping
          ref: 'User',
          required: true,
        },
        channel: {
          type: Schema.Types.ObjectId,  // one to who "subscriber" is subscriping
          ref: 'User',
          required: true,
        }
    },{ timestamps: true })


export const User = mongoose.model("User", userSchema);