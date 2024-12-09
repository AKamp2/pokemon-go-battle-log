const React = require('react');
const helper = require('./helper.js');
const { useState, useEffect } = React;

const SearchableDropdown = ({ options, value, onChange, placeholder }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredOptions, setFilteredOptions] = useState([]);

    useEffect(() => {
        setFilteredOptions(
            options
                .filter((option) =>
                    option.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .slice(0, 20) // Limit to 20 results
        );
    }, [searchTerm, options]);

    return (
        <div className="dropdown">
            <input
                type="text"
                placeholder={placeholder}
                value={value || searchTerm}
                onChange={(e) => {
                    setSearchTerm(e.target.value);
                    onChange(''); // Clear selection when typing
                }}
                className="dropdownInput"
            />
            {searchTerm && (
                <div className="dropdownContent">
                    {filteredOptions.map((option) => (
                        <div
                            key={option}
                            className="dropdownOption"
                            onClick={() => {
                                onChange(option);
                                setSearchTerm(''); // Reset search term
                            }}
                        >
                            {option}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const BattleForm = ({ triggerReload }) => {
    const [pokemonList, setPokemonList] = useState([]);
    const [playerPokemon, setPlayerPokemon] = useState(['', '', '']);
    const [enemyPokemon, setEnemyPokemon] = useState(['', '', '']);
    const [league, setLeague] = useState('');
    const [outcome, setOutcome] = useState('');

    useEffect(() => {
        const fetchPokemon = async () => {
            try {
                //pokeAPI call here
                const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1030');
                const data = await response.json();
                setPokemonList(data.results.map((pokemon) => pokemon.name));
            } catch (error) {
                console.error('Error fetching Pokemon:', error);
            }
        };
        fetchPokemon();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!league || playerPokemon.includes('') || enemyPokemon.includes('') || !outcome) {
            helper.handleError('Please fill out all fields.');
            return;
        }

        try {
            await helper.sendPost('/addBattle', {
                league,
                playerPokemon,
                enemyPokemon,
                outcome,
            }, () => {
                triggerReload(); // Reload data after successful submission
            });
        } catch (err) {
            console.error('Error logging battle:', err);
        }
    };

    return (
        <form id="battleForm" onSubmit={handleSubmit} className="battleForm">
            <h2>Add Battle</h2>
            <div>
                <label htmlFor="leagueSelect">League: </label>
                <select id="leagueSelect" value={league} onChange={(e) => setLeague(e.target.value)}>
                    <option value="">Select a League</option>
                    <option value="LittleCup">Little Cup</option>
                    <option value="GreatLeague">Great League</option>
                    <option value="UltraLeague">Ultra League</option>
                    <option value="MasterLeague">Master League</option>
                </select>
            </div>
            <div>
                <h3>Player Pokemon:</h3>
                {playerPokemon.map((pokemon, index) => (
                    <SearchableDropdown
                        key={`player-${index}`}
                        options={pokemonList}
                        value={pokemon}
                        placeholder={`Pokemon ${index + 1}`}
                        onChange={(value) =>
                            setPlayerPokemon((prev) =>
                                prev.map((p, i) => (i === index ? value : p))
                            )
                        }
                    />
                ))}
            </div>
            <div>
                <h3>Enemy Pokemon:</h3>
                {enemyPokemon.map((pokemon, index) => (
                    <SearchableDropdown
                        key={`enemy-${index}`}
                        options={pokemonList}
                        value={pokemon}
                        placeholder={`Pokemon ${index + 1}`}
                        onChange={(value) =>
                            setEnemyPokemon((prev) =>
                                prev.map((p, i) => (i === index ? value : p))
                            )
                        }
                    />
                ))}
            </div>
            <div>
                <label htmlFor="outcomeSelect">Outcome: </label>
                <select id="outcomeSelect" value={outcome} onChange={(e) => setOutcome(e.target.value)}>
                    <option value="">Select Outcome</option>
                    <option value="Win">Win</option>
                    <option value="Loss">Loss</option>
                </select>
            </div>
            <input type="submit" value="Log Battle" />
        </form>
    );
};

module.exports = BattleForm;