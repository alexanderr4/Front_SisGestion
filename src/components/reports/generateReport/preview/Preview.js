import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSheetPlastic } from '@fortawesome/free-solid-svg-icons';
import './Preview.css';

function Preview({ document, setLoading, setShowToast, loading }) {
useEffect (() => {
  if (document && loading) {
    setLoading(false)
    setShowToast(true)
  }
}, [document])

  

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