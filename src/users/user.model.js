import mongoose from 'mongoose';

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "The name is required"],
        unique: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    role: {
        type: String,
        required: true,
        enum: ["ADMIN", "USER"],
    },
    books: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Book',
        default: [] 
    },
    state: {
        type: Boolean,
        default: true,
    },
    google: {
        type: Boolean,
        default: true,
    },
});

UserSchema.methods.toJSON = function() {
    const { __v, password, _id, ...user } = this.toObject();
    user.uid = _id;
    return user;
}

export default mongoose.model('User', UserSchema);