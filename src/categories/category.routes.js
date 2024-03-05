import { Router } from "express";
import { check } from "express-validator";
import {
    categoriesGet,
    categoryPost,
    categoryDelete,
    categoryPut
    } from "./category.controller.js"


    const router = Router();

    router.get("/", categoriesGet);
    
    router.post(
        "/", [
            check("categoryName", "The username is required").not().isEmpty(),
            check("description", "The username is required").not().isEmpty(),
            // validarCampos
        ],categoryPost
    );

    router.put(
        "/:id",[
            check("description", "The username is required").not().isEmpty(),
        ],categoryPut
    );

    router.delete(
        "/:id",
            // validarJWT,
        categoryDelete
    );

    
export default router;