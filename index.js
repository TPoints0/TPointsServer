const express = require("express");
const fs = require("fs");
const cors = require("cors");
const bcrypt = require("bcrypt");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Registrierung
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  const users = JSON.parse(fs.readFileSync("users.json", "utf8"));
  const userExists = users.find(u => u.username === username);

  if (userExists) {
    return res.status(400).json({ message: "Benutzername bereits vergeben" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    username,
    password: hashedPassword,
    points: 0,
    lastDaily: null,
    lastSpin: null
  };

  users.push(newUser);
  fs.writeFileSync("users.json", JSON.stringify(users, null, 2));
  res.json({ message: "Registrierung erfolgreich" });
});

// Login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const users = JSON.parse(fs.readFileSync("users.json", "utf8"));
  const user = users.find(u => u.username === username);

  if (!user) {
    return res.status(400).json({ message: "Benutzer nicht gefunden" });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    return res.status(400).json({ message: "Falsches Passwort" });
  }

  res.json({ message: "Login erfolgreich", username, points: user.points });
});

app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});
//Testzeile

