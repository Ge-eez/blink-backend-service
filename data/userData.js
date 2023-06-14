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
    firstName: "User",
    lastName: "Two",
    username: "User2",
    phone: "1234567890",
    email: "user2@example.com",
    password: bcrypt.hashSync("userPassword", 10),
    role: "user",
  },
  {
    firstName: "User",
    lastName: "Three",
    username: "User3",
    phone: "1234567890",
    email: "user3@example.com",
    password: bcrypt.hashSync("userPassword", 10),
    role: "user",
  },
  {
    firstName: "User",
    lastName: "Four",
    username: "User4",
    phone: "1234567890",
    email: "user4@example.com",
    password: bcrypt.hashSync("userPassword", 10),
    role: "user",
  },
  {
    firstName: "User",
    lastName: "Five",
    username: "User5",
    phone: "1234567890",
    email: "user5@example.com",
    password: bcrypt.hashSync("userPassword", 10),
    role: "user",
  },
  {
    firstName: "User",
    lastName: "Six",
    username: "User6",
    phone: "1234567890",
    email: "user6@example.com",
    password: bcrypt.hashSync("userPassword", 10),
    role: "user",
  },
  {
    firstName: "User",
    lastName: "Seven",
    username: "User7",
    phone: "1234567890",
    email: "user7@example.com",
    password: bcrypt.hashSync("userPassword", 10),
    role: "user",
  },
  {
    firstName: "User",
    lastName: "Eight",
    username: "User8",
    phone: "1234567890",
    email: "user8@example.com",
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
