import { Router } from "express";
import { check } from "express-validator";
import {
    userPost, 
    usersGet, 
    userPut,
    userDelete
    } from "./user.controller.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { emailExists} from "../helpers/db-validators.js";


const router = Router();

router.get("/", usersGet);

router.post(
    "/", [
        check("name", "The name is required").not().isEmpty(),
        check("password", "Password must be greater than 6 characters").isLength({min: 6,}),
        check("email", "The email entered is not valid ").isEmail(),
        check("email").custom(emailExists),
        check("role", "The role is required.").not().isEmpty(),
        validarCampos
    ],userPost
);

router.put(
    "/",[
        validarJWT,
        check("name", "The name is required").not().isEmpty(),
        check("role", "The role is required.").not().isEmpty(),
    ],userPut
);

router.delete(
    "/",
    validarJWT,
    userDelete
);

export default router;
