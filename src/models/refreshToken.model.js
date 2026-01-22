import { pool } from "../config/db.js";

export const findRefreshTokenByUser = async (userId) => {
  const result = await pool.query(
    `SELECT * FROM refresh_tokens
     WHERE user_id = $1 AND revoked = false
     ORDER BY created_at DESC
     LIMIT 1`,
    [userId]
  );
  return result.rows[0];
};

export const revokeRefreshToken = async (id) => {
  await pool.query(
    "UPDATE refresh_tokens SET revoked = true WHERE id = $1",
    [id]
  );
};
