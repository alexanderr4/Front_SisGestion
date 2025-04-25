import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { faSheetPlastic } from '@fortawesome/free-solid-svg-icons';
import './Preview.css';

function Preview () {
  return (
    <div className="preview">
      <FontAwesomeIcon className="icon-faSheetPlastic-preview" icon={faSheetPlastic} />
      <p>Configure los parámetros y genere el reporte para ver una vista previa</p>
    </div>
  );
}

export default Preview;