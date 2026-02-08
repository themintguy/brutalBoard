import { Request, Response } from "express";
import pool from "../../config/db";

const ROUND_DURATION_MS = 3 * 60 * 1000;

export const getGameState = async (req: Request, res: Response) => {
  try {
    let roundResult = await pool.query(
      "SELECT id, started_at FROM game_rounds WHERE is_active = true LIMIT 1",
    );

    if (roundResult.rows.length === 0) {
      const newRound = await pool.query(
        "INSERT INTO game_rounds DEFAULT VALUES RETURNING id, started_at",
      );
      roundResult = newRound;
    }

    let round = roundResult.rows[0];

    const now = Date.now();
    const startedAt = new Date(round.started_at).getTime();
    let remainingMs = Math.max(ROUND_DURATION_MS - (now - startedAt), 0);

    if (remainingMs === 0) {
      // end old round
      await pool.query(
        `
        UPDATE game_rounds
        SET is_active = false, ended_at = NOW()
        WHERE id = $1
        `,
        [round.id],
      );

      const newRoundRes = await pool.query(
        `
        INSERT INTO game_rounds DEFAULT VALUES
        RETURNING id, started_at
        `,
      );

      round = newRoundRes.rows[0];
      remainingMs = ROUND_DURATION_MS;
    }

    const tilesResult = await pool.query(
      `
      SELECT
        t.id,
        t.x,
        t.y,
        tc.user_id,
        u.color
      FROM tiles t
      LEFT JOIN tile_claims tc
        ON tc.tile_id = t.id AND tc.round_id = $1
      LEFT JOIN users u
        ON u.id = tc.user_id
      ORDER BY t.y, t.x
      `,
      [round.id],
    );

    const tiles = tilesResult.rows.map((tile) => ({
      id: tile.id,
      x: tile.x,
      y: tile.y,
      claimedBy: tile.user_id || null,
      color: tile.color || null,
    }));

    res.json({
      roundId: round.id,
      startedAt: round.started_at,
      remainingMs,
      tiles,
    });
  } catch (err) {
    console.error("getGameState error:", err);
    res.status(500).json({ error: "Failed to load game state" });
  }
};
