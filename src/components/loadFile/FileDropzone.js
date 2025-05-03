import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faUpload } from '@fortawesome/free-solid-svg-icons';
import './FileDropzone.css';


const XmlDropzone = ({ getRootProps, getInputProps, isDragActive, file, disabled }) => {
    const rootProps = getRootProps({
        onClick: (event) => disabled && event.preventDefault(),
        onDrop: (event) => {
            if (disabled) {
                event.preventDefault();
                event.stopPropagation();
            }
        },
        onDragOver: (event) => {
            if (disabled) {
                event.preventDefault();
                event.stopPropagation();
            }
        },
        onDragEnter: (event) => {
            if (disabled) {
                event.preventDefault();
                event.stopPropagation();
            }
        },
        onDragLeave: (event) => {
            if (disabled) {
                event.preventDefault();
                event.stopPropagation();
            }
        },
    });
   

    return (
        <div {...rootProps} className={`file-dropzone ${disabled ? 'disabled' : ''}`}>
            <input {...getInputProps({ accept: ".xml" })} disabled={disabled} />

            {file ? (
                <div className="file-preview">
                    <p className="file-name">📄 {file.name}</p>
                </div>
            ) : (
                <div className="overlay-text">
                    <FontAwesomeIcon className="icon" icon={faUpload} /> 
                    {isDragActive ? "Suelta el archivo aquí..." : "Haga clic para cargar o arrastre y suelte (XML)"}
                </div>
            )}
        </div>
    );
};

export default XmlDropzone;