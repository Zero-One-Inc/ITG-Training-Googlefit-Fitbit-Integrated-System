
import config from "config";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    firstName: {
        type: String,
        maxlength: 50,
        minlength: 1,
        trim: true,
        required: true
    },
    lastName: {
        type: String,
        maxlength: 50,
        minlength: 1,
        trim: true,
        required: true
    },
    email: {
        type: String,
        maxlength: 255,
        minlength: 8,
        trim: true,
        required: true,
        unique: true,
        dropDups: true 
    },
    password: {
        type: String,
        maxlength: 255,
        minlength: 6,
        required: true,
    }
});

userSchema.methods.generateAuthToken = () => {
    const token = jwt.sign({userID: this._id, email: email}, config.get("JWT_SECRET_KEY"));
    return token;
}

const User = mongoose.model("User", userSchema);

export default User;