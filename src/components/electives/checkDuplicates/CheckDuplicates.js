import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faTriangleExclamation, faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import DataElectives from "./DataElectives";
import "./CheckDuplicates.css";


function CheckDuplicates({ electives }) {
  const navigate = useNavigate();

  useEffect(() => {
  }, [])

  const hadleButtonClickBack = () => {
    navigate(-1);
  }

  const customStyles = {
    table: {
      style: {
        border: 'none', // Borde exterior de toda la tabla
        borderRadius: '5px',
        padding: '1px',
        marginBottom: '2px',
        borderCollapse: 'separate',
        borderBottom: 'solid 1px #000000',
        width: "auto",
      },
    },

    rows: {
      style: {
        // Cambia este color al que quieras
        borderTop: '1px solid #000000',
        borderBottom: 'none', // Cambia este color al que quieras
      },
    },
  };

  return (
    <div className='content-check-duplicates-electives'>
      <div className='content-title'>
        <button onClick={() => hadleButtonClickBack()}> <FontAwesomeIcon className="icon-faArrowLeft" icon={faArrowLeft} /> </button>
        <h3>Verificación de Duplicados</h3>
      </div>
      <div className='status-check-duplicates'>
        <>
          <div className='content-status-check-duplicates'>
            <FontAwesomeIcon className="icon-status-check-duplicates" icon={faTriangleExclamation} />
            <h3>Atención</h3>
          </div>
          <p>Se han encontrado 4 estudiantes con inscripciones duplicadas de electivas del mismo semestre.</p>
        </>
        <>
          <div className='content-status-check-duplicates'>
            <FontAwesomeIcon className="icon-status-check-duplicates" icon={faCircleCheck} />
            <h3>Todo esta bien</h3>
          </div>
          <p>No se encontraron inscripciones duplicadas. Puedes continuar con tranquilidad.</p>
        </>
      </div>
      <div className='title-and-text-check-duplicates'>
        <h3>Electivas Duplicadas</h3>
        <p>Estudiantes que tienen inscritas dos o más electivas del mismo semestre</p>
        <div className={`number-check-duplicates-${1 ? 'red' : 'green'}`}>
          4 Duplicados encontrados
        </div>
        <div className='content-table-check-duplicates'>
          <DataTable
            customStyles={customStyles}
            noDataComponent={<><br /> No hay datos para mostrar  <br /> <br /></>}
          />
        </div>
      </div>
      <DataElectives/>
    </div>
  );
}

export default CheckDuplicates;