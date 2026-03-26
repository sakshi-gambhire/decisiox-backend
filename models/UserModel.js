import pool from "../config/db.js";

export const createUser = async (name, email, password, role) => {
  const result = await pool.query(
    `INSERT INTO users (name, email, password, role)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [name, email, password, role]
  );

  return result.rows[0]; // ✅ THIS IS CRITICAL
};

export const findUserByEmail = async (email) => {

  const query = `
    SELECT *
    FROM users
    WHERE LOWER(TRIM(email)) = LOWER(TRIM($1))
  `;

  const result = await pool.query(query, [email]);

  return result.rows[0];

};
// GET ALL USERS (ADMIN)
export const getAllUsers = async () => {

  const query = `
    SELECT id, name, email, role, created_at
    FROM users
    ORDER BY created_at DESC
  `;

  const result = await pool.query(query);

  return result.rows;

};

// DELETE USER
export const deleteUserById = async (id) => {

  const query = `
    DELETE FROM users
    WHERE id = $1
  `;

  await pool.query(query, [id]);

};

// PROMOTE USER TO ADMIN
export const promoteToAdmin = async (id) => {

  const query = `
    UPDATE users
    SET role = 'admin'
    WHERE id = $1
  `;

  await pool.query(query, [id]);

};
export const getPlatformStats = async () => {

  const users = await pool.query(
    "SELECT COUNT(*) FROM users"
  );

  const admins = await pool.query(
    "SELECT COUNT(*) FROM users WHERE role='admin'"
  );

  const simulations = await pool.query(
    "SELECT COUNT(*) FROM simulations"
  );

  return {
  totalUsers: Number(users.rows[0].count),
  totalAdmins: Number(admins.rows[0].count),
  totalSimulations: Number(simulations.rows[0].count)
};

};
export const updateUserProfile = async (userId, name, email) => {

  const result = await pool.query(
    `UPDATE users
     SET name = $1, email = $2
     WHERE id = $3
     RETURNING id, name, email`,
    [name, email, userId]
  );

  return result.rows[0];

};
export const findUserById = async (userId) => {

  const result = await pool.query(
    "SELECT * FROM users WHERE id = $1",
    [userId]
  );

  return result.rows[0];

};

export const updateUserPassword = async (userId, hashedPassword) => {

  await pool.query(
    `UPDATE users
     SET password = $1
     WHERE id = $2`,
    [hashedPassword, userId]
  );

};
