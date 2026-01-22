import bcrypt from "bcrypt"
import { env } from "../config/env.js"

export const hashPassword = async(pass)=>{
    return bcrypt.hash(pass, env.BCRYPT_SALT_ROUNDS);
};

export const comparePassword = async(pass,hash)=>{
    return bcrypt.compare(pass,hash);
};