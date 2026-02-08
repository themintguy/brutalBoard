import pool from "../../config/db";
import { v4 as uuidv4 } from "uuid";
import { Request, Response } from "express";

const randomColor = (): string => {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 70%, 55%)`;
};

export const joinUser = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    const userId = uuidv4();
    const color = randomColor();

    const result = await pool.query(
      `
      INSERT INTO users (id, name, color)
      VALUES ($1, $2, $3)
      RETURNING id, name, color
      `,
      [userId, name || "Anonymous", color],
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create user" });
  }
};
