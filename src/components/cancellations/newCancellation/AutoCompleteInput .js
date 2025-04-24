import React, { useState } from 'react';    
import './FormNewCancellation'; // Asegúrate de tener estilos para la lista de sugerencias

const AutoCompleteInput = ({ label, name, options, value, onChange, type, placeholder }) => {
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    onChange(e); // actualiza el valor en el componente padre

    const filtered = options.filter((option) =>
      option.toLowerCase().includes(inputValue.toLowerCase())
    );
    setFilteredOptions(filtered);
    setShowSuggestions(filtered.length > 0);
  };

  const handleSelectOption = (option) => {
    onChange({ target: { name, value: option } }); // simula evento
    setShowSuggestions(false);
  };

  const handleKeyDown = (e) => {
    if (type === 'number' && ['e', 'E', '+', '-'].includes(e.key)) {
        e.preventDefault();
    }
};

  return (
    <>
      <label>{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={handleInputChange}
        onFocus={() => {
          const filtered = options.filter((option) =>
            option.toLowerCase().includes(value.toLowerCase())
          );
          setFilteredOptions(filtered);
          setShowSuggestions(filtered.length > 0);
        }}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
        placeholder={`Buscar ${placeholder}`}
        onKeyDown={handleKeyDown}
      />
      {showSuggestions && (
        <ul className="suggestions-list">
          {filteredOptions.map((option, idx) => (
            <li key={idx} onClick={() => handleSelectOption(option)}>
              {option}
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default AutoCompleteInput;
