import dotenv from "dotenv";
dotenv.config();
import { startRoundTicker, startRoundTimer } from "./services/round.service";


import * as http from "http";
import app from "./server";
import { initSocket } from "./config/socket";

const PORT = process.env.PORT || 4000;
const server = http.createServer(app);

initSocket(server);
startRoundTimer();
startRoundTicker();




server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
