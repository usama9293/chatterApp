import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";
import ejsMate from "ejs-mate";

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(path.resolve(), "views"));

// Routes
app.get("/", (req, res) => {
  res.render("room");
});

app.get("/javascript", (req, res) => {
  res.render("javascript");
});

app.get("/python", (req, res) => {
  res.render("python");
});
app.get("/html", (req, res) => {
  res.render("html");
});
//namespace
const tech = io.of("/tech");

tech.on("connection", (socket) => {
  socket.on('join', (data) => {
    socket.join(data.room);
    tech.in(data.room).emit('message', `A new user joined the ${data.room} room!`);
  });

  socket.on("message", (data) => {
    tech.in(data.room).emit("message", data.msg);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
