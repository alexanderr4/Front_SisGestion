import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCheck, faXmark, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import DataTable from 'react-data-table-component';
import { useNavigate, } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import { getCancellations } from "../../../api/Cancellations";
import "./PendingRequests.css";

function PendingRequests() {


  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const dataCancellations = useRef(null)
  const [records, setRecords] = useState([]);

  const hadleButtonClickBack = () => {
    navigate(-1)
  }

  useEffect(() => {
    const fetch = async () => {
      await fetchAndStoreData(getCancellations, dataCancellations).then((response) => {
        setRecords(dataCancellations.current.data);
      })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });

    }

    fetch();


  }, []);


  const fetchAndStoreData = async (fetchFunction, dataRef) => {
    try {
      setLoading(true);
      const response = await fetchFunction();
      dataRef.current = response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    return formattedDate;
  }

  const columnsTable = [
    {
      name: "ID",
      selector: row => row.id,
      sortable: true,
      width: '8%',
    },
    {
      name: "Estudiante",
      selector: row => row.student.name.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
      sortable: true,
    },
    {
      name: "Asignatura",
      selector: row => row.subject.name,
      sortable: true,
    },
    {
      name: "Grupo",
      selector: row => row.subject.group,
      sortable: true,
      width: '10%',
    },
    {
      name: "Motivo",
      selector: row => row.justification,
      sortable: true,
    },
    {
      name: "Fecha",
      selector: row => formatDate(row.created_at),
      sortable: true,
      width: '15%',
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

  const handleSearch = (e) => {
    try {
      setRecords(dataCancellations.current.data.filter(record => {
        console.log("record", record)
        return record.student.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
          record.subject.name.toLowerCase().includes(e.target.value.toLowerCase())
      }));
    } catch (error) {
      console.error("Error al filtrar los datos:", error);
    }

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
    <div className='content-pending-requests'>
      <div className='content-title'>
        <button onClick={() => hadleButtonClickBack()}> <FontAwesomeIcon className="icon-faArrowLeft" icon={faArrowLeft} /> </button>
        <h3>Solicitudes de Cancelación Pendientes</h3>
      </div>

      <div className='content-body'>
        <h3>Gestión de Solicitudes</h3>
        <p>Revise y apruebe o rechace las solicitudes de cancelación pendientes</p>
        <div className='row'>
          <div className='content-search col-7'>
            <FontAwesomeIcon className="icon-faSearch" icon={faMagnifyingGlass} />
            <input
              type="search"
              placeholder='Buscar por estudiante o por asignatura...'
              className='input-id-student'
              onChange={handleSearch}
            />
          </div>
          <div className='col-5 asignature-pending'>
            <p>{dataCancellations.current && dataCancellations.current.data ? dataCancellations.current.data.length : 20} Pendientes</p>
          </div>
        </div>

        <div className='content-table'>
          <DataTable
            columns={columnsTable}
            data={records}
            customStyles={customStyles}
            paginationPerPage={1}
            fixedHeader
            noDataComponent={<><br/> No hay datos para mostrar  <br/></>}
            fixedHeaderScrollHeight="35vh"

          />
        </div>
      </div>
      {loading && (
        <div className="loading-overlay">
          <Spinner animation="grow" role="status">
            <span className="visually-hidden">Cargando...</span>
          </Spinner>
        </div>
      )}

    </div>
  );
}

export default PendingRequests;