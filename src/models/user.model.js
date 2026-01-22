import { pool } from "../config/db.js";

export const findUserByEmail = async(email)=>{
    const res=await pool.query(
        "select * from users where email=$1", [email]
    );
    return res.rows[0];
}

export const createUser= async({email,passwordHash, role})=>{
    const res= await pool.query(
    `INSERT INTO users (email, password_hash, role, is_active)
     VALUES ($1, $2, $3, true)
     RETURNING id, email, role`,
    [email, passwordHash, role]
    )
    return res.rows[0];
}