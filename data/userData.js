const bcrypt = require("bcrypt");

const usersData = [
  {
    firstName: "User",
    lastName: "One",
    username: "User1",
    phone: "1234567890",
    email: "user1@example.com",
    password: bcrypt.hashSync("userPassword", 10),
    role: "user",
  },
  {
    firstName: "Admin",
    lastName: "One",
    username: "Admin1",
    phone: "1234567891",
    email: "admin1@example.com",
    password: bcrypt.hashSync("adminPassword", 10),
    role: "admin",
  },
  {
    firstName: "Mod",
    lastName: "One",
    username: "Mod1",
    phone: "1234567892",
    email: "mod1@example.com",
    password: bcrypt.hashSync("moderatorPassword", 10),
    role: "moderator",
  },
];

module.exports = usersData;
