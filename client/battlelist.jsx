const React = require('react');
const helper = require('./helper.js');
const { useState, useEffect } = React;

const fetchPokemonSprite = async (pokemonName) => {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch sprite for ${pokemonName}`);
        }
        const data = await response.json();
        return data.sprites.other["official-artwork"].front_default;
    } catch (err) {
        console.error(err);
        return "/path/to/placeholder.png"; // Provide a placeholder image in case of errors
    }
};

// Map for better league display
const leagueDisplayMap = {
    LittleCup: 'Little Cup',
    GreatLeague: 'Great League',
    UltraLeague: 'Ultra League',
    MasterLeague: 'Master League',
};

const BattleEntry = ({ battle, handleDelete }) => {
    const [playerSprites, setPlayerSprites] = useState([]);
    const [opponentSprites, setOpponentSprites] = useState([]);

    useEffect(() => {
        const fetchSprites = async () => {
            const playerPromises = battle.playerPokemon.map((pokemon) => fetchPokemonSprite(pokemon));
            const opponentPromises = battle.enemyPokemon.map((pokemon) => fetchPokemonSprite(pokemon));

            const playerResults = await Promise.all(playerPromises);
            const opponentResults = await Promise.all(opponentPromises);

            setPlayerSprites(playerResults);
            setOpponentSprites(opponentResults);
        };

        fetchSprites();
    }, [battle]);

    return (
        <div className="battle-entry">
            <div className="battle-header">
                <span className="battle-league">{leagueDisplayMap[battle.league] || battle.league}</span>
                <span className="battle-outcome">{battle.outcome}</span>
                <button className="battle-delete" onClick={() => handleDelete(battle._id)}>
                    Delete
                </button>
            </div>
            <div className="battle-teams">
                <div className="player-team">
                    <h3>Player Team</h3>
                    <div className="pokemon-group">
                        {battle.playerPokemon.map((pokemon, index) => (
                            <div key={pokemon} className="pokemon-entry">
                                <img src={playerSprites[index]} alt={pokemon} className="pokemon-sprite" />
                                <span className="pokemon-label">{pokemon}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="vs-text">VS</div>
                <div className="opponent-team">
                    <h3>Opponent Team</h3>
                    <div className="pokemon-group">
                        {battle.enemyPokemon.map((pokemon, index) => (
                            <div key={pokemon} className="pokemon-entry">
                                <img src={opponentSprites[index]} alt={pokemon} className="pokemon-sprite" />
                                <span className="pokemon-label">{pokemon}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const BattleList = ({ reloadBattles, triggerReload }) => {
    const [battles, setBattles] = useState([]);

    useEffect(() => {
        const loadBattlesFromServer = async () => {
            try {
                const response = await fetch('/getBattles');
                if (!response.ok) {
                    throw new Error('Failed to fetch battles');
                }
                const data = await response.json();
                setBattles(data.battles);
            } catch (err) {
                console.error('Error loading battles:', err);
            }
        };

        loadBattlesFromServer();
    }, [reloadBattles]);

    //this is for the delete button
    const handleDelete = async (id) => {
        try {
            await helper.sendPost('/deleteBattle', { id }, () => {
                triggerReload(); // Reload data after successful deletion
            });
        } catch (err) {
            helper.handleError('Failed to delete battle.');
            console.error('Error deleting battle:', err);
        }
    };

    if (battles.length === 0) {
        return (
            <div className="battleList">
                <h3 className="emptyBattle">No Battles Logged Yet!</h3>
            </div>
        );
    }

    return (
        <div className="battleList">
            {battles.map((battle) => (
                <BattleEntry key={battle._id} battle={battle} handleDelete={handleDelete} />
            ))}
        </div>
    );
};

module.exports = BattleList;