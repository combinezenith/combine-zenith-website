import { createServer } from "http";
import next from "next";

const port = process.env.PORT || 3000;
const dev = false; // always production in cPanel
const app = next({ dev, dir: "." });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    handle(req, res);
  }).listen(port, () => {
    console.log("Next.js running on port", port);
  });
});
