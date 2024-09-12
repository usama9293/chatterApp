import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";
import ejsMate from "ejs-mate";

const app = express();
const server = createServer(app); // Creating an HTTP server for socket.io
const io = new Server(server); // Initialize socket.io on the server

// Setup middleware
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set EJS and EJS-Mate
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(path.resolve(), "views"));

// Routes
app.get("/", (req, res) => {
  res.render("body");
});

// Socket.io Connection
io.on("connection", (socket) => {
  console.log("connected");

  socket.on("message", (msg) => {
    console.log(msg);
    io.emit("message", msg);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
    io.emit("message", "A user disconnected");
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
