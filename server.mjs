import { createServer } from "http";
import next from "next";

const port = process.env.PORT || 3000;
const app = next({ dev: false, dir: "." });
const handle = app.getRequestHandler();

await app.prepare();

createServer((req, res) => handle(req, res)).listen(port, () => {
  console.log(`Next.js running on port ${port}`);
});
