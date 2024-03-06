import mongoose from 'mongoose';

const BookSchema = mongoose.Schema({
    bookName: {
        type: String,
        required: [true, "The book name is required"],
        unique: true
    },
    foreword: {
        type: String,
        required: [true, "Foreword is required"]
    },
    author: {
        type: String,
        required: [true, "Author is required"]
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, "Category is required"]
    },
    state: {
        type: Boolean,
        default: true,
    }
});

export default mongoose.model('Book', BookSchema);