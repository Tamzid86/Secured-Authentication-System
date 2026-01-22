import { findUserByEmail, createUser } from "../../models/user.model.js";
import { comparePassword } from "../../utils/hash.js";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../../utils/token.js";
import { findRefreshTokenByUser, revokeRefreshToken,} from "../../models/refreshToken.model.js";
import { pool } from "../../config/db.js";
import bcrypt from "bcrypt";
import { env } from "../../config/env.js";
import { hashPassword } from "../../utils/hash.js";

export const loginService=async(email,pass)=>{
    const user = await findUserByEmail(email);
    if(!user || !user.is_active){
        throw new Error("Invalid credentials")
    }
    if (!isValid) {
      await logSecurityEvent({
        eventType: "REFRESH_TOKEN_REUSE",
        ip: "unknown",
        userId,
      });
      throw new Error("Refresh token reuse detected");
    }
    

    const matchPass= await comparePassword(pass, user.password_hash);
    if(!matchPass){
        throw new Error("Invalid password")
    }
    const payload={
        sub: user.id,
        role: user.role
    }

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    const hashedRefreshToken = await bcrypt.hash(refreshToken, env.BCRYPT_SALT_ROUNDS)
    await pool.query(
    `INSERT INTO refresh_tokens (user_id, token_hash, expires_at, revoked)
     VALUES ($1, $2, NOW() + INTERVAL '7 days', false)`,
    [user.id, hashedRefreshToken]
    );
    return{
        user:{
            id:user.id, email:user.email, role: user.role
        },
        accessToken,
        refreshToken
    };
};

export const refreshTokenService = async (incomingToken) => {
  const decoded = verifyRefreshToken(incomingToken);
  const userId = decoded.sub;

  const storedToken = await findRefreshTokenByUser(userId);
  if (!storedToken) {
    throw new Error("Refresh token not found");
  }

  const isValid = await bcrypt.compare(
    incomingToken,
    storedToken.token_hash
  );

  if (!isValid) {
    throw new Error("Refresh token reuse detected");
  }

  await revokeRefreshToken(storedToken.id);

  const payload = { sub: userId, role: decoded.role };

  const newAccessToken = generateAccessToken(payload);
  const newRefreshToken = generateRefreshToken(payload);

  const hashedNewRefreshToken = await bcrypt.hash(newRefreshToken, 12);

  await pool.query(
    `INSERT INTO refresh_tokens (user_id, token_hash, expires_at, revoked)
     VALUES ($1, $2, NOW() + INTERVAL '7 days', false)`,
    [userId, hashedNewRefreshToken]
  );

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};

export const registerService = async(email,password,role)=>{
  const existingUser= await findUserByEmail(email);
  if(existingUser){
    throw new Error("The user with the same email already exists")
  }
  const passwordHash= await hashPassword(password);

  const user = await createUser({
    email, passwordHash, role
  });
  return user;
}