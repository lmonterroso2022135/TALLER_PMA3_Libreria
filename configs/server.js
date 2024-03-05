'use strict'
import Category from '../src/categories/category.model.js';


import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { dbConnection } from './mongo.js';
import userRoutes from '../src/users/user.routes.js';
import authRoutes from '../src/auth/auth.routes.js';
import categoryRoutes from '../src/categories/category.routes.js';

class Server{
    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.userPath = '/library/v1/users';
        this.authPath = '/library/v1/auth';
        // this.bookPath = '/library/v1/publications';
        this.caregoryPath = '/library/v1/categories';
        this.middlewares();
        this.connectDB();
        this.routes();
    }
    async connectDB(){
        await dbConnection();
        const existingCategory = await Category.findOne({ categoryName: 'Books' });
        if(!existingCategory){
            Category.create({
                categoryName: 'Books',
                description: 'This book doesnt have a category yet'
            })    
        }
    }
    middlewares(){
        this.app.use(express.urlencoded({extended: false}));
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(helmet());
        this.app.use(morgan('dev'));
    }
    routes(){
        this.app.use(this.userPath, userRoutes);
        this.app.use(this.authPath, authRoutes);
    //     this.app.use(this.bookPath, );
        this.app.use(this.caregoryPath, categoryRoutes);
    }
    listen(){
        this.app.listen(this.port, () => {
            console.log('Server running on port ',this.port);

        });
    }
}
export default Server;