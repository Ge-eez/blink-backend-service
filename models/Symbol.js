// symbol.js
const mongoose = require('mongoose');

const symbolSchema = new mongoose.Schema(
  {
    character: { type: String, unique: true, required: true }, // Unicode representation
    representation: { type: String, required: true }, // Actual form
    form: { type: String, required: true }, // The form (could be removed if not applicable to numbers/expressions)
    type: { type: String, enum: ['letter', 'number', 'expression'], required: true }, // Type of the symbol
  },
  { timestamps: true } // Enable automatic timestamps
);

module.exports = mongoose.model('Symbol', symbolSchema);
