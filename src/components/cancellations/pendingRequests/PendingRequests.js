import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { faArrowLeft, faCheck, faXmark, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import DataTable from 'react-data-table-component';
import { useNavigate, Outlet } from 'react-router-dom';
import "./PendingRequests.css";

function PendingRequests() {


  const navigate = useNavigate();
  
  const hadleButtonClickBack = () => {
    navigate(-1)
  }

  const data = [
    { id: 201924738, name: "Jose Alexander Romero", asignatura: "Ingenieria de Software", grupo: "01", motivo: "Bajo rendimiento", fecha: "23/04/2025" },
    { id: 201920123, name: "Mariana López Gómez", asignatura: "Bases de Datos", grupo: "03", motivo: "Incompatibilidad horaria", fecha: "20/04/2025", }
  ]

  const [records, setRecords] = useState(data);


  const columnsTable = [
    {
      name: "ID",
      selector: row => row.id,
      sortable: true,
    },
    {
      name: "Estudiante",
      selector: row => row.name,
      sortable: true,
    },
    {
      name: "Asignatura",
      selector: row => row.asignatura,
      sortable: true,
    },
    {
      name: "Grupo",
      selector: row => row.grupo,
      sortable: true,
    },
    {
      name: "Motivo",
      selector: row => row.motivo,
      sortable: true,
    },
    {
      name: "Fecha",
      selector: row => row.fecha,
      sortable: true,
    },
    {
      name: "Acciones",
      cell: row => (
        <div className='buttons-pending-requests'>
          <button onClick={() => console.log('Editar', row)}>
            <FontAwesomeIcon className='icon-check' icon={faCheck} />
          </button>
          <button onClick={() => console.log('Eliminar', row)}>
            <FontAwesomeIcon className='icon-Xmark' icon={faXmark} />
          </button>
        </div>
      ),
      ignoreRowClick: true, // evita que al hacer clic se seleccione la fila
      allowOverflow: true,
      button: true,
    }
  ]

  const handleSearch= (e) => {
    setRecords(data.filter(record => {
        return record.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
            record.asignatura.toLowerCase().includes(e.target.value.toLowerCase())
    }));
}

  const customStyles = {
    table: {
      style: {
        border: '1px solid #000000', // Borde exterior de toda la tabla
        borderRadius: '5px',
        padding: '1px',
        borderCollapse: 'separate'
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
    <div>
      <div className='content-title'>
        <button onClick={() => hadleButtonClickBack()}> <FontAwesomeIcon className="icon-faArrowLeft" icon={faArrowLeft} /> </button>
        <h3>Solicitudes de Cancelación Pendientes</h3>
      </div>

      <div className='content-body'>
        <h3>Formulario de Cancelación de Asignatura</h3>
        <p>Complete los datos del estudiante y la asignatura a cancelar</p>
        <div className='row'>
          <div className='content-search col-6'>
            <FontAwesomeIcon className="icon-faSearch" icon={faMagnifyingGlass} />
            <input 
            type="search" 
            placeholder='Buscar por estudiante o por asignatura...' 
            className='input-id-student' 
            onChange={handleSearch}
            />
          </div>
          <div className='col-6 asignature-pending'>
            <p>{3} Pendientes</p>
          </div>
        </div>

        <div className='content-table'>
          <DataTable
            columns={columnsTable}
            data={records}
            customStyles={customStyles}
          />
        </div>
      </div>


    </div>
  );
}

export default PendingRequests;