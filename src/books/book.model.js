import mongoose from 'mongoose';

const BookSchema = mongoose.Schema({
    bookName: {
        type: String,
        required: [true, "The book name is required"],
        unique: true
    },
    description: {
        type: String,
        required: [true, "Description is required"]
    },
    category: {
        
    },
    state: {
        type: Boolean,
        default: true,
    },

})