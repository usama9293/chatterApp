import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";
import ejsMate from "ejs-mate";

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.static("public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(path.resolve(), "public")));

// Use method-override middleware

// Set EJS as the view engine
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");

app.set("views", path.join(path.resolve(), "views"));

const PORT = 3000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get("/", (req, res) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

io.on("connection", (socket) => {
  console.log("user connected");
  socket.emit("message", "Hello from server");
  socket.on("another event", (data) => {
    console.log(data);
  });
});
