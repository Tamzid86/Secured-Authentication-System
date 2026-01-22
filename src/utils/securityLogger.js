import { pool } from "../config/db.js";

export const logSecurityEvent = async ({
  eventType,
  ip,
  userId = null,
  metadata = {},
}) => {
  await pool.query(
    `INSERT INTO security_events (event_type, ip_address, user_id, metadata)
     VALUES ($1, $2, $3, $4)`,
    [eventType, ip, userId, metadata]
  );
};
