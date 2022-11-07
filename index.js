const http = require("http");
const app = require("./app");
const server = http.createServer(app);

const port = 9000;

server.listen(port, () => {
  console.log(`BE Server started ${port}`);
});
