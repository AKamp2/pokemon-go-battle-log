const express = require('express');
require('dotenv').config();

const router = express.Router();
const fetch = require('node-fetch');

// Route to fetch Pokemon data
// handles both the images and just the names
router.get('/api/pokemon', async (req, res) => {
  try {
    if (req.query.name) {
      const response = await fetch(`${process.env.POKEMON_API_URL}pokemon/${req.query.name}`);
      if (!response.ok) {
        throw new Error('Failed to fetch Pokemon details.');
      }
      const data = await response.json();
      return res.json({
        name: data.name,
        spriteUrl: data.sprites.other['official-artwork'].front_default,
      });
    }

    const apiUrl = `${process.env.POKEMON_API_URL}pokemon?limit=1030`;
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch Pokemon list.');
    }
    const data = await response.json();
    return res.json(
      data.results.map((pokemon) => ({
        name: pokemon.name,
      })),
    );
  } catch (err) {
    console.error('Error fetching Pokemon data:', err);
    return res.status(500).json({ error: 'Failed to fetch Pokemon data.' });
  }
});

module.exports = router;
