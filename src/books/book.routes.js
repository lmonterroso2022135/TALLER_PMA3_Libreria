import { Router } from "express";
import { check } from "express-validator";

import {
    bookPost,
    booksGet,
    bookPut,
    bookDelete,

    rentBook,
    returnBook,
    booksGetAZ,
    booksGetZA,
    booksAuthor,
    bookCategory
    } from "./book.controller.js"
    import { validarJWT } from "../middlewares/validar-jwt.js";
    import { validarCampos } from "../middlewares/validar-campos.js";
    import { isAdmin } from "../middlewares/validate-roles.js";
import { bookExists } from "../helpers/db-validators.js";


const router = Router();

router.get("/", booksGet);

router.post(
    "/",
    [
        validarJWT,
        isAdmin,
        check("bookName", "bookName is required").not().isEmpty(),
        check("bookName").custom(bookExists),
        check("foreword", "Foreword is required").not().isEmpty(),
        check("author", "Author is required").not().isEmpty(),
        check("category", "Category is required").not().isEmpty(), 
        validarCampos
    ],bookPost
);

router.put(
    "/:id",
    [
        validarJWT,
        isAdmin,
        check("bookName", "bookName is required").not().isEmpty(),
        check("bookName").custom(bookExists),
        check("foreword", "Foreword is required").not().isEmpty(),
        check("author", "Author is required").not().isEmpty(),
        check("category", "Category is required").not().isEmpty(), 
    ],bookPut
)

router.delete(
    "/:id",
    validarJWT,
    isAdmin,
    bookDelete
)
// Consultas

router.get(
    "/AZ",
    booksGetAZ
)
router.get(
    "/ZA",
    booksGetZA
)
router.post(
    "/forCategory",
    bookCategory
)
router.post(
    "/forAuthor",
    booksAuthor
)



// Operaciones de usuarios
router.post(
    "/rent",
    [
        validarJWT,
        check("bookName", "bookName is required").not().isEmpty(),
    ],rentBook
)

router.post(
    "/return",
    [
        validarJWT,
        check("bookName", "bookName is required").not().isEmpty(),
    ], returnBook
)

export default router;