CREATE TABLE game_rounds (
    id SERIAL PRIMARY KEY,
    started_at TIMESTAMP NOT NULL DEFAULT NOW(),
    ended_at TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);


CREATE TABLE users (
    id UUID PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    color VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE tiles (
  id SERIAL PRIMARY KEY,
  x INT NOT NULL,
  y INT NOT NULL,
  UNIQUE (x, y)
);

INSERT INTO tiles (x, y)
SELECT x, y
FROM generate_series(0, 7) AS x,
     generate_series(0, 7) AS y;


CREATE TABLE tile_claims (
  id SERIAL PRIMARY KEY,
  round_id INT REFERENCES game_rounds(id) ON DELETE CASCADE,
  tile_id INT REFERENCES tiles(id),
  user_id UUID REFERENCES users(id),
  claimed_at TIMESTAMP DEFAULT NOW(),
  UNIQUE (round_id, tile_id)
);


# SELECT user_id, COUNT(*) AS tiles_owned
# FROM tile_claims
# WHERE round_id = $1
# GROUP BY user_id
# ORDER BY tiles_owned DESC
# LIMIT 1;


