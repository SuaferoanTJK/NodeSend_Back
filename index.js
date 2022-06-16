const express = require("express");
const dbConnect = require("./config/db");
const cors = require("cors");

const app = express(); // Create the server
dbConnect(); // Connect to the database
const port = process.env.PORT || 4000; // Define app port
app.use(express.json()); // Enable reading from body

// Enable CORS
const corsOption = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
};
app.use(cors(corsOption));

app.use(express.static("uploads")); // Enable public folder

// App routes
app.use("/api/users", require("./routes/users"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/links", require("./routes/links"));
app.use("/api/files", require("./routes/files"));

app.listen(port, "0.0.0.0", () => {
  console.log(
    `El servidor esta funcionando en el puerto http://localhost:${port}`
  );
});
