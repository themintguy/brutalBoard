import pool from "../../config/db";
import { Request, Response } from "express";
import { getIO } from "../../config/socket";

export const claimTile = async (req: Request, res: Response) => {
  try {
    const { tileId, userId } = req.body;

    const roundResult = await pool.query(
      "SELECT id FROM game_rounds WHERE is_active = true LIMIT 1",
    );

    if (roundResult.rows.length === 0) {
      return res.status(400).json({ error: "No active round" });
    }

    const roundId = roundResult.rows[0].id;

    
    const claimResult = await pool.query(
      `
      INSERT INTO tile_claims (round_id, tile_id, user_id)
      VALUES ($1, $2, $3)
      RETURNING *
      `,
      [roundId, tileId, userId],
    );

    const userResult = await pool.query(
      "SELECT color FROM users WHERE id = $1",
      [userId],
    );

    const color = userResult.rows[0]?.color;

    const io = getIO();

    io.emit("tile-claimed", {
      roundId,
      tileId,
      userId,
      color,
    });

    res.json({
      success: true,
      claim: claimResult.rows[0],
    });
  } catch (err: any) {
    
    if (err.code === "23505") {
      return res.status(409).json({ error: "Tile already claimed" });
    }

    console.error(err);
    res.status(500).json({ error: "Failed to claim tile" });
  }
};
