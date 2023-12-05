import mongoose from "mongoose";

const Upload = {
    name: { type: String },
    AWSCode: { type: String }
};

const UserSchema = new mongoose.Schema({
    email: { type: String },
    password: { type: String },
    imgCollection: [Upload]
});
  

export const UserModel = mongoose.model("users", UserSchema);