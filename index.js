const app = require("express")();
const server = require("http").Server(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:8080",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});
const players = new Map();

server.listen(3000, () => {
  console.log("listening on *:3000");
});

app.get("/", (req, res) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header(
    "Access-Control-Allow-Headers",
    "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "PUT, DELETE, OPTIONS");
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  socket.emit("chat message", "ようそこチャットアプリへ");
  socket.broadcast.emit("chat message", "新しいユーザが接続しました。");
  console.log(socket.id);
  socket.on("disconnect", () => {
    io.emit("chat message", "あるユーザの接続が切れました");
  });
  socket.on("register name", (name) => {
    players.set(socket.id, name);
    io.emit("players changed", Array.from(players));
  });
  socket.on("drawer changed", (drawer) => {
    io.emit("drawer changed", drawer);
  });
  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
  });
  socket.on("draw line", (payload) => {
    io.emit("draw line", payload);
  });
  socket.on("start draw", (payload) => {
    io.emit("start draw", payload);
  });
  socket.on("end draw", () => {
    io.emit("end draw");
  });
  socket.on("delete all", () => {
    io.emit("delete all");
  });
});
