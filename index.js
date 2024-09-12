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
  res.render("body");
});


//namespace
const tech=io.of("/tech")

// Socket.io Connection
tech.on("connection", (socket) => {
  console.log("connected");

  socket.on("message", (msg) => {
    console.log(msg);
    tech.emit("message", msg);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
    tech.emit("message", "A user disconnected");
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
