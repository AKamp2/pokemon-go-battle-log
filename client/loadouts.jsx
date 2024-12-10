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

const Loadouts = ({ populatePlayerPokemon }) => {
    const [loadouts, setLoadouts] = useState([]);
    const [newLoadout, setNewLoadout] = useState({ name: '', pokemon: ['', '', ''] });
    const [isLoading, setIsLoading] = useState(false);
    const [pokemonList, setPokemonList] = useState([]);

    // Fetch saved loadouts and Pokémon list
    useEffect(() => {
        const fetchLoadouts = async () => {
            try {
                const response = await fetch('/getLoadouts');
                if (!response.ok) {
                    throw new Error('Failed to fetch loadouts');
                }
                const data = await response.json();
                setLoadouts(data.loadouts);
            } catch (err) {
                console.error('Error fetching loadouts:', err);
            }
        };

        const fetchPokemonList = async () => {
            try {
                const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1000');
                const data = await response.json();
                setPokemonList(data.results.map((pokemon) => pokemon.name));
            } catch (error) {
                console.error('Error fetching Pokémon list:', error);
            }
        };

        fetchLoadouts();
        fetchPokemonList();
    }, []);

    const handleCreateLoadout = async (e) => {
        e.preventDefault();
        if (newLoadout.pokemon.some((poke) => poke === '') || newLoadout.name.trim() === '') {
            helper.handleError('Please provide a name and select 3 Pokémon.');
            return;
        }

        try {
            setIsLoading(true);
            await helper.sendPost('/addLoadout', newLoadout, (result) => {
                setLoadouts((prevLoadouts) => [...prevLoadouts, result.loadout]);
                setNewLoadout({ name: '', pokemon: ['', '', ''] });
            });
        } catch (err) {
            console.error('Error creating loadout:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="loadouts">
            <h2>Team Loadouts</h2>

            {/* Create Loadout Form */}
            <form onSubmit={handleCreateLoadout} className="loadout-form">
                <input
                    type="text"
                    placeholder="Loadout Name"
                    value={newLoadout.name}
                    onChange={(e) => setNewLoadout({ ...newLoadout, name: e.target.value })}
                />
                {newLoadout.pokemon.map((poke, index) => (
                    <SearchableDropdown
                        key={`loadout-${index}`}
                        options={pokemonList}
                        value={poke}
                        placeholder={`Pokémon ${index + 1}`}
                        onChange={(value) => {
                            const updatedPokemon = [...newLoadout.pokemon];
                            updatedPokemon[index] = value;
                            setNewLoadout({ ...newLoadout, pokemon: updatedPokemon });
                        }}
                    />
                ))}
                <button type="submit" disabled={isLoading}>Create Loadout</button>
            </form>

            <h3>Saved Loadouts</h3>
            {loadouts.length > 0 ? (
                <select
                    onChange={(e) => {
                        const selectedLoadout = loadouts.find((l) => l._id === e.target.value);
                        if (selectedLoadout) {
                            populatePlayerPokemon(selectedLoadout.pokemon);
                        }
                    }}
                >
                    <option value="">Select a Loadout</option>
                    {loadouts.map((loadout) => (
                        <option key={loadout._id} value={loadout._id}>
                            {loadout.name}
                        </option>
                    ))}
                </select>
            ) : (
                <p>No loadouts saved yet.</p>
            )}
        </div>
    );
};

module.exports = Loadouts;