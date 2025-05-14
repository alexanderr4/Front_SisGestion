import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { faSheetPlastic } from '@fortawesome/free-solid-svg-icons';
import './Preview.css';

function Preview({ document }) {
  return (
    <div className="preview">
      {document === null ? (<>
        <FontAwesomeIcon className="icon-faSheetPlastic-preview" icon={faSheetPlastic} />
        <p>Configure los parámetros y genere el reporte para ver una vista previa</p>
      </>
      ) : (
        <>
          <iframe
            src={document.url}
            width="100%"
            height="600px"
            style={{ border: 'none' }}
            title="Vista previa del PDF"
          />
        </>
      )}

    </div>
  );
}

export default Preview;