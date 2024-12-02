const mongoose = require('mongoose');
const _ = require('underscore');

const setLeague = (league) => _.escape(league).trim();

const BattleSchema = new mongoose.Schema({
  league: {
    type: String,
    required: true,
    trim: true,
    set: setLeague,
  },
  playerPokemon: {
    type: [String], // Array of Pokémon names
    required: true,
    validate: [(val) => val.length === 3, 'Must have exactly 3 Pokémon.'],
  },
  enemyPokemon: {
    type: [String], // Array of opponent Pokémon names
    required: true,
    validate: [(val) => val.length === 3, 'Must have exactly 3 Pokémon.'],
  },
  outcome: {
    type: String,
    enum: ['Win', 'Loss'],
    required: true,
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

BattleSchema.statics.toAPI = (doc) => ({
  league: doc.league,
  playerPokemon: doc.playerPokemon,
  enemyPokemon: doc.enemyPokemon,
  outcome: doc.outcome,
});

const BattleModel = mongoose.model('Battle', BattleSchema);
module.exports = BattleModel;