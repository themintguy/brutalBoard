import pool from "../config/db";
import { getIO } from "../config/socket";

const ROUND_DURATION = 3 * 60 * 1000;
const TICK_INTERVAL = 1000;


export const startRoundTimer = () => {
  setInterval(async () => {
    try {
      // 1. Get active round
      const roundRes = await pool.query(
        "SELECT id FROM game_rounds WHERE is_active = true LIMIT 1",
      );

      if (roundRes.rows.length === 0) return;

      const roundId = roundRes.rows[0].id;

      // 2. End current round
      await pool.query(
        `
        UPDATE game_rounds
        SET is_active = false, ended_at = NOW()
        WHERE id = $1
        `,
        [roundId],
      );

      // 3. Calculate winner
      const winnerRes = await pool.query(
        `
        SELECT user_id, COUNT(*) AS tiles
        FROM tile_claims
        WHERE round_id = $1
        GROUP BY user_id
        ORDER BY tiles DESC
        LIMIT 1
        `,
        [roundId],
      );

      const winner = winnerRes.rows[0] || null;

      // 4. Create new round
      const newRound = await pool.query(
        "INSERT INTO game_rounds DEFAULT VALUES RETURNING id",
      );

      // 5. Broadcast result
      const io = getIO();

      io.emit("round-ended", {
        roundId,
        winner,
        newRoundId: newRound.rows[0].id,
      });

      console.log("Round reset");
    } catch (err) {
      console.error("Round timer error:", err);
    }
  }, ROUND_DURATION);
};


export const startRoundTicker = () => {
  setInterval(async () => {
    const roundRes = await pool.query(
      "SELECT started_at FROM game_rounds WHERE is_active = true LIMIT 1",
    );

    if (roundRes.rows.length === 0) return;

    const startedAt = new Date(roundRes.rows[0].started_at).getTime();
    const now = Date.now();

    const remainingMs = Math.max(ROUND_DURATION - (now - startedAt), 0);

    getIO().emit("round-tick", { remainingMs });
  }, TICK_INTERVAL);
};

