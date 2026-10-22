import { Schema, model } from "mongoose";

const userSchema = new Schema({
    username: {type: String, default:null},
    email: {type: String, default:null, unique: true},
    password: {type: String, default:null},
    profileImage: {type: String, default: null},
    resetPasswordToken: {type: String, default:null},
    resetPasswordExpiry: {type: Date, default:null}
}, {timestamps: true})

const User = model("User", userSchema)

export default User

