const Symbol = require("../models/Symbol");
const User = require('../models/User'); // Replace with the actual path to the User model
const bcrypt = require("bcrypt");

const lettersData = [
  { character: "u1200", representation: "ሀ", type: "letter", form: "1" },
  { character: "u1201", representation: "ሁ", type: "letter", form: "2" },
  { character: "u1202", representation: "ሂ", type: "letter", form: "3" },
  { character: "u1203", representation: "ሃ", type: "letter", form: "4" },
  { character: "u1204", representation: "ሄ", type: "letter", form: "5" },
  { character: "u1205", representation: "ህ", type: "letter", form: "6" },
  { character: "u1206", representation: "ሆ", type: "letter", form: "7" },
  { character: "u1208", representation: "ለ", type: "letter", form: "1" },
  { character: "u1209", representation: "ሉ", type: "letter", form: "2" },
  { character: "u120A", representation: "ሊ", type: "letter", form: "3" },
  { character: "u120B", representation: "ላ", type: "letter", form: "4" },
  { character: "u120C", representation: "ሌ", type: "letter", form: "5" },
  { character: "u120D", representation: "ል", type: "letter", form: "6" },
  { character: "u120E", representation: "ሎ", type: "letter", form: "7" },
  { character: "u1210", representation: "ሐ", type: "letter", form: "1" },
  { character: "u1211", representation: "ሑ", type: "letter", form: "2" },
  { character: "u1212", representation: "ሒ", type: "letter", form: "3" },
  { character: "u1213", representation: "ሓ", type: "letter", form: "4" },
  { character: "u1214", representation: "ሔ", type: "letter", form: "5" },
  { character: "u1215", representation: "ሕ", type: "letter", form: "6" },
  { character: "u1216", representation: "ሖ", type: "letter", form: "7" },
  { character: "u1218", representation: "መ", type: "letter", form: "1" },
  { character: "u1219", representation: "ሙ", type: "letter", form: "2" },
  { character: "u121A", representation: "ሚ", type: "letter", form: "3" },
  { character: "u121B", representation: "ማ", type: "letter", form: "4" },
  { character: "u121C", representation: "ሜ", type: "letter", form: "5" },
  { character: "u121D", representation: "ም", type: "letter", form: "6" },
  { character: "u121E", representation: "ሞ", type: "letter", form: "7" },
  { character: "u1220", representation: "ሠ", type: "letter", form: "1" },
  { character: "u1221", representation: "ሡ", type: "letter", form: "2" },
  { character: "u1222", representation: "ሢ", type: "letter", form: "3" },
  { character: "u1223", representation: "ሣ", type: "letter", form: "4" },
  { character: "u1224", representation: "ሤ", type: "letter", form: "5" },
  { character: "u1225", representation: "ሥ", type: "letter", form: "6" },
  { character: "u1226", representation: "ሦ", type: "letter", form: "7" },
  { character: "u1228", representation: "ረ", type: "letter", form: "1" },
  { character: "u1229", representation: "ሩ", type: "letter", form: "2" },
  { character: "u122A", representation: "ሪ", type: "letter", form: "3" },
  { character: "u122B", representation: "ራ", type: "letter", form: "4" },
  { character: "u122C", representation: "ሬ", type: "letter", form: "5" },
  { character: "u122D", representation: "ር", type: "letter", form: "6" },
  { character: "u122E", representation: "ሮ", type: "letter", form: "7" },
  { character: "u1230", representation: "ሰ", type: "letter", form: "1" },
  { character: "u1231", representation: "ሱ", type: "letter", form: "2" },
  { character: "u1232", representation: "ሲ", type: "letter", form: "3" },
  { character: "u1233", representation: "ሳ", type: "letter", form: "4" },
  { character: "u1234", representation: "ሴ", type: "letter", form: "5" },
  { character: "u1235", representation: "ስ", type: "letter", form: "6" },
  { character: "u1236", representation: "ሶ", type: "letter", form: "7" },
  // Continue this pattern for all other Amharic letters...
];
let lettersCount = 0;
const migrateLetters = async () => {
  for (const letterData of lettersData) {
    const { character } = letterData;
    const letter = await Symbol.findOne({ character });
    if (!letter) {
      await Symbol.create(letterData);
      lettersCount += 1;
    }
  }
  console.log(`Migration of ${lettersCount} letters completed!`);
};

let usersCount = 0;
const usersData = [
  {
    firstName: 'User',
    lastName: 'One',
    username: 'User1',
    phone: '1234567890',
    email: 'user1@example.com',
    password: bcrypt.hashSync('userPassword', 10),
    role: 'user',
  },
  {
    firstName: 'Admin',
    lastName: 'One',
    username: 'Admin1',
    phone: '1234567891',
    email: 'admin1@example.com',
    password: bcrypt.hashSync('adminPassword', 10),
    role: 'admin',
  },
  {
    firstName: 'Mod',
    lastName: 'One',
    username: 'Mod1',
    phone: '1234567892',
    email: 'mod1@example.com',
    password: bcrypt.hashSync('moderatorPassword', 10),
    role: 'moderator',
  }
];
const migrateUsers = async () => {
  for (const userData of usersData) {
    const { email } = userData;
    const user = await User.findOne({ email });
    if (!user) {
      await User.create(userData);
      usersCount += 1;
    }
  }
  console.log(`Migration of ${usersCount} users completed!`);
};

const migrate = async () => {
  await migrateLetters();
  await migrateUsers();
};

module.exports = migrate;
