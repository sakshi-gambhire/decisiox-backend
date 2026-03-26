// pages/BiasDetector.jsx
import BiasQuiz from "../components/bias/BiasQuiz";
const db = require("../config/db");

const createBiasTable = async () => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS bias_profiles (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      bias VARCHAR(100),
      explanation TEXT,
      suggestion TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
};

module.exports = { createBiasTable };

const BiasDetector = () => {
  return (
    <div className="container">
      <h1>🧠 Cognitive Bias Detector</h1>
      <BiasQuiz />
    </div>
  );
};

export default BiasDetector;