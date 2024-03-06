import { response, request } from "express";
import Book from './book.model.js';
import Category from "../categories/category.model.js";
import User from "../users/user.model.js"

export const bookPost = async (req, res) => {
    const {bookName, foreword, author, category} = req.body;
    const cate = await Category.findOne({categoryName: category});

    if(!cate){
        return res.status(404).json({ msg: 'Category doesnt exits in the database' });
    };
    if(!cate.state){
        return res.status(404).json({ msg: 'Category was removed.' });
    };

    const book = new Book({bookName, foreword, author, category: cate._id});
    await book.save();

    res.status(200).json({
        book
    });
}

export const booksGet = async (req = request, res = response) => {
    const query = {state: true};

    const  [total, books] = await Promise.all([
        Book.countDocuments(query),
        Book.find(query)
        .populate('category', ['categoryName','description'])
    ])
    res.status(200).json({
        msg: 'Books available.',
        total,
        books
    }); 
}

export const bookPut = async (req, res = response) => {
    const {id} =   req.params;
    const {_id, category, ...resto} = req.body;

    const cate = await Category.findOne({categoryName: category});

    if(!cate){
        return res.status(404).json({ msg: 'Category doesnt exits in the database' });
    };
    if(!cate.state){
        return res.status(404).json({ msg: 'Category was removed.' });
    };

    const book = await Book.findByIdAndUpdate(id, {...resto, category: cate._id});

    res.status(200).json({
        msg: 'Book actualized',
        book
    });
}

export const bookDelete = async (req, res) => {
    const {id} =   req.params;
    const book = await Book.findByIdAndUpdate(id, {state: false});

    res.status(200).json({
        msg: 'Retired book',
        book
    });
}
// filtros y consultas

export const booksGetAZ = async (req, res) => {
    const query = {state: true};

    try {
        const booksAZ = await Book.find(query).sort({bookName: 1});
        const total = await Book.countDocuments(query);

        res.status(200).json({
            msg: 'Books available.',
            total,
            booksAZ
        })
    } catch (e) {
        console.error("Error:", e);
        res.status(500).json({ message: "Ordering error books" });
    }
}

export const booksGetZA = async (req, res) => {
    const query = {state: true};

    try {
        const booksZA = await Book.find(query).sort({bookName: -1});
        const total = await Book.countDocuments(query);

        res.status(200).json({
            msg: 'Books available.',
            total,
            booksZA
        })
    } catch (e) {
        console.error("Error:", e);
        res.status(500).json({ message: "Ordering error books" });
    }
}

export const booksAuthor = async (req, res) => {
    const {author} = req.body;

    try {
        const books = await Book.find({ author, state: true });

        res.status(200).json({
            msg: 'Books available by author found.',
            total: books.length,
            books
        });  
    } catch (e) {
        console.error("Error:", e);
        res.status(500).json({ message: "Ordering error books fro author" }); 
    }
     
}

export const bookCategory = async (req, res) => {
    const {category} = req.body;

    try {
        const cate = await Category.findOne({categoryName: category})

        if(!cate){
            return res.status(404).json({ msg: 'Category doesnt exits in the database' });
        };

        const books = await Book.find({category: cate._id, state: true})

        res.status(200).json({
            msg: 'Books available by author found.',
            total: books.length,
            books
        });  
    } catch (e) {
        console.error("Error:", e);
        res.status(500).json({ message: "Ordering error books for category" }); 
    }
}

/// Prestamo de libros

export const rentBook = async (req, res = response) => {
    const {id} = req.user;
    const {bookName} = req.body;

    const user = await User.findById(id);

    const book = await Book.findOne({bookName});

    if (user.books.length >= 2) {
        return res.status(400).json({ msg: 'You have already rented the maximum number of books.' });
    }
    if(!book){
        return res.status(404).json({ msg: 'Book doesnt exits in the database.' });
    };
    if(!book.state){
        return res.status(404).json({ msg: 'Book is not available.' });
    };

    user.books.push(book._id);
    book.state = false;

    await book.save();
    await user.save();


    res.status(200).json({
        msg: 'Successfully rented book',
        user
    })

}

export const returnBook = async (req, res = response) => {
    const {id} = req.user;
    const {bookName} = req.body;

    const user = await User.findById(id);

    const book = await Book.findOne({bookName});

    if (user.books.length === 0) {
        return res.status(400).json({ msg: 'You dont have any book' });
    }
    if(!book){
        return res.status(404).json({ msg: 'Book doesnt exits in the database.' });
    };
    if(book.state){
        return res.status(404).json({ msg: 'You dont have this book'});
    };

    user.books = user.books.filter(bookId => bookId.toString() !== book._id.toString());
    book.state = true;

    await book.save();
    await user.save();

    
    res.status(200).json({
        msg: 'Successfully return book',
        user
    })
}