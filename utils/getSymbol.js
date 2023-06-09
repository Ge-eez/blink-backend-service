const Symbol = require("../models/Symbol");

const getSymbol = async (character) => {
  try {
    const symbol = await Symbol.findOne({ character });
    return symbol ? symbol : null;
  } catch (err) {
    console.error(err);
    return null;
  }
};

module.exports = getSymbol;
