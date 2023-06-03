const Letter = require('../models/Letter');

const lettersData = [
    { "character": "\u1200", "letter": "ሀ", "form": "1" },
    { "character": "\u1201", "letter": "ሁ", "form": "2" },
    { "character": "\u1202", "letter": "ሂ", "form": "3" },
    { "character": "\u1203", "letter": "ሃ", "form": "4" },
    { "character": "\u1204", "letter": "ሄ", "form": "5" },
    { "character": "\u1205", "letter": "ህ", "form": "6" },
    { "character": "\u1206", "letter": "ሆ", "form": "7" },
    { "character": "\u1208", "letter": "ለ", "form": "1" },
    { "character": "\u1209", "letter": "ሉ", "form": "2" },
    { "character": "\u120A", "letter": "ሊ", "form": "3" },
    { "character": "\u120B", "letter": "ላ", "form": "4" },
    { "character": "\u120C", "letter": "ሌ", "form": "5" },
    { "character": "\u120D", "letter": "ል", "form": "6" },
    { "character": "\u120E", "letter": "ሎ", "form": "7" },
    { "character": "\u1210", "letter": "ሐ", "form": "1" },
    { "character": "\u1211", "letter": "ሑ", "form": "2" },
    { "character": "\u1212", "letter": "ሒ", "form": "3" },
    { "character": "\u1213", "letter": "ሓ", "form": "4" },
    { "character": "\u1214", "letter": "ሔ", "form": "5" },
    { "character": "\u1215", "letter": "ሕ", "form": "6" },
    { "character": "\u1216", "letter": "ሖ", "form": "7" },
    { "character": "\u1218", "letter": "መ", "form": "1" },
    { "character": "\u1219", "letter": "ሙ", "form": "2" },
    { "character": "\u121A", "letter": "ሚ", "form": "3" },
    { "character": "\u121B", "letter": "ማ", "form": "4" },
    { "character": "\u121C", "letter": "ሜ", "form": "5" },
    { "character": "\u121D", "letter": "ም", "form": "6" },
    { "character": "\u121E", "letter": "ሞ", "form": "7" },
    // Repeat this pattern for all other Amharic letters...
  ];  
  

const migrateLetters = async () => {
  for (const letterData of lettersData) {
    const { character } = letterData;
    const letter = await Letter.findOne({ character });
    if (!letter) {
      await Letter.create(letterData);
    }
  }
  console.log('Migration completed!');
};

module.exports = migrateLetters;
