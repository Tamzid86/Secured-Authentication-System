import dotenv from "dotenv";

dotenv.config();

export const env={
    PORT: process.env.PORT,
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
    ACCESS_TOKEN_EXPIRES_IN:"15m",
    REFRESH_TOKEN_EXPIRES_IN:"7d",

    BCRYPT_SALT_ROUNDS: 12,

    DATABASE_URL:process.env.DATABASE_URL 
}