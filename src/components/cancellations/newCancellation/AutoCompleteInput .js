import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort } from '@fortawesome/free-solid-svg-icons';
import './FormNewCancellation'; // agrega useRef

const AutoCompleteInput = ({ label, name, options, value, onChange, type, placeholder, searchField }) => {
    const [filteredOptions, setFilteredOptions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isValidOption, setIsValidOption] = useState(false);
    const clickedOption = useRef(false); // NUEVO

    useEffect(() => {
        onChange({ target: { name, value: { code: '', name: '' } } });
    }, [label]); // Dependencias vacías para evitar advertencias de React

    const handleInputChange = (e) => {
        try {
            const inputValue = e.target.value;
            onChange(e);
            if (searchField === 'name') {
                const filtered = options.filter((option) =>
                    option[searchField].toLowerCase().includes(inputValue.toLowerCase())
                );
                setFilteredOptions(filtered);
                setShowSuggestions(filtered.length > 0);
                setIsValidOption(options.some(option => option[searchField].toLowerCase() === inputValue.toLowerCase()));
            } else {
                const filtered = options.filter((option) =>
                    option[searchField].toString().includes(inputValue.toString())
                );
                setFilteredOptions(filtered);
                setShowSuggestions(filtered.length > 0);
                setIsValidOption(options.some(option => option[searchField].toString() === inputValue.toString()));
            }
        } catch (error) {
            console.error("Error al filtrar las opciones:", error);
        }
    };

    const handleSelectOption = (option) => {
        onChange({ target: { name, value: option } });
        setShowSuggestions(false);
        setIsValidOption(true);
        clickedOption.current = true; // MARCAMOS que fue selección válida
    };


    const handleKeyDown = (e) => {
        if (type === 'number' && ['e', 'E', '+', '-'].includes(e.key)) {
            e.preventDefault();
        }
    };

    const handleBlur = () => {
        setTimeout(() => {
            setShowSuggestions(false);
            if (clickedOption.current) {
                clickedOption.current = false; // reseteamos el click
                return; // No hacemos nada, fue clic válido
            }
            if (!isValidOption) {
                onChange({ target: { name, value: { code: '', name: '' } } });
            }
        }, 150);
    };

    const onFocus = () => {
        try {
            let filtered;
            if (searchField === 'name') {
                filtered = options.filter((option) =>
                    option[searchField].toLowerCase().includes(value.name?.toLowerCase() || '')
                );
            } else {
                filtered = options.filter((option) =>
                    option[searchField].toString().includes(value.code?.toString() || '')
                );
            }
            setFilteredOptions(filtered);
            setShowSuggestions(true); // mostrar siempre que hay opciones (aunque sea vacío)
        } catch (error) {
            console.error("Error al filtrar las opciones:", error);
        }
    };

    return (
        <>
            <label>{label}</label>
            <div className='content-input-with-icon'>
                <input
                    type={type}
                    name={name}
                    value={searchField === "name"? value.name : value.code}
                    onChange={handleInputChange}
                    onFocus={onFocus}
                    onBlur={handleBlur}
                    placeholder={`Buscar ${placeholder}`}
                    onKeyDown={handleKeyDown}
                    onWheel={(e) => e.target.blur()}
                    autoComplete="off"
                    autoCorrect="off"        // iOS/Safari
                    spellCheck="false"       // desactiva sugerencias de texto
                    required
                />
                <FontAwesomeIcon size="xs" icon={faSort} />
            </div>

            {showSuggestions && (
                <ul className="suggestions-list">
                    {filteredOptions.map((option) => (
                        <li key={option.id} onClick={() => handleSelectOption(option)}>
                            {option[searchField]}
                        </li>
                    ))}
                </ul>
            )}
        </>
    );
};

export default AutoCompleteInput;
