const mongoose = require('mongoose');
const _ = require('underscore');

const setName = (name) => _.escape(name).trim();

const LoadoutSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },
  pokemon: {
    type: [String], // Array of Pokemon names
    required: true,
    validate: [(val) => val.length === 3, 'A loadout must have exactly 3 Pokemon.'],
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

LoadoutSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  pokemon: doc.pokemon,
});

const LoadoutModel = mongoose.model('Loadout', LoadoutSchema);
module.exports = LoadoutModel;
