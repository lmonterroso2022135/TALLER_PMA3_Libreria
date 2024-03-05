import { response, request } from "express";
import Category from './category.model.js';

export const categoryPost = async (req, res) => {
    const {categoryName, description} = req.body;
    const category = new Category({categoryName, description});

    await category.save();

    res.status(200).json({
        category
    });
}

export const categoriesGet = async (req = request, res = response) => {
    const query = {state: true};

    const [total, categories] = await Promise.all([
        Category.countDocuments(query),
        Category.find(query)
    ]);
    res.status(200).json({
        total,
        categories
    });    
}

export const categoryPut = async (req, res = response) => {
    const{id} = req.params;
    const {categoryName, ...resto } = req.body;

    const category = await Category.findByIdAndUpdate(id, resto);

    res.status(200).json({
        msg: 'Category actualized',
        category
    });
}


export const categoryDelete = async (req, res) => {
    const{id} = req.params; 
    const category = await Category.findByIdAndUpdate(id, {state: false});

    res.status(200).json({
        msg: 'Category eliminated',
        category
    });
}