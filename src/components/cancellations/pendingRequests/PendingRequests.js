import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCheck, faXmark, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import DataTable from 'react-data-table-component';
import { useNavigate, } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import { getCancellations, updateCancellation } from "../../../api/Cancellations";
import CustomToast from '../../toastMessage/CustomToast';
import "./PendingRequests.css";

function PendingRequests() {


  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const dataCancellations = useRef(null)
  const [records, setRecords] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('');
  const [approvedTransaction, setApprovedTransaction] = useState(false);
  const [actualRow, setActualRow] = useState({});
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [reasonReject, setReasonReject] = useState('');

  const hadleButtonClickBack = () => {
    navigate(-1)
  }

  useEffect(() => {
    const fetch = async () => {
      await fetchAndStoreData(getCancellations, dataCancellations).then((response) => {
        setRecords(dataCancellations.current);
      })
        .catch((error) => {
          console.error("Error fetching data:", error);

        });
    }
    fetch();
  }, [approvedTransaction]);


  const fetchAndStoreData = async (fetchFunction, dataRef) => {
    try {
      setLoading(true);
      const response = await fetchFunction();
      dataRef.current = response.data.data.filter(item => item.status === 'pending');
    } catch (error) {
      console.error("Error fetching data:", error);
      if (typeof error.status !== 'undefined')
        setShowToast(true);
      setToastMessage(`${error.status} Error al cargar los datos`);
      setToastType('error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setShowRejectModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    return formattedDate;
  }

  const handleSendRejectReason = (e) => {
    e.preventDefault();
    handleUpdateStatus('rejected', actualRow.id);
    setShowRejectModal(false);
  }

  const savedLocalStorageData = () => {
    const data = {
      id: actualRow.id,
      reason: reasonReject,
    }
    if (localStorage.getItem("reasonReject")) {
      const listaActual = JSON.parse(localStorage.getItem("reasonReject")) || [];
      listaActual.push(data);
      localStorage.setItem("reasonReject", JSON.stringify(listaActual));
    } else {
      localStorage.setItem("reasonReject", JSON.stringify([data]));
    }
  };

  const handleUpdateStatus = async (status, id) => {
    setLoading(curret => { return true });
    await updateCancellation(id, status)
      .then((response) => {
        setShowToast(true);
        setToastMessage('Solicitud actualizada correctamente');
        setToastType('success');
        setLoading(false);
        setApprovedTransaction(true);
        if (status === 'rejected') {
          savedLocalStorageData();
        }
      }
      )
      .catch((error) => {
        console.error("Error al actualizar la solicitud:", error);
        setShowToast(true);
        setToastMessage(`${error.status} Error al actualizar la solicitud`);
        setToastType('error');
      });
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
      selector: row => row.group,
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
          <button onClick={() => handleUpdateStatus('approved', row.id)}>
            <FontAwesomeIcon className='icon-check' icon={faCheck} />
          </button>
          <button onClick={() => {
            setActualRow(row)
            //setShowRejectModal(true)
            handleUpdateStatus('rejected', row.id);
          }}>
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
      setRecords(dataCancellations.current.filter(record => {
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
            <p>{dataCancellations?.current ? dataCancellations.current.length : 0} Pendientes</p>
          </div>
        </div>

        <div className='content-table'>
          <DataTable
            columns={columnsTable}
            data={records}
            customStyles={customStyles}
            paginationPerPage={1}
            fixedHeader
            noDataComponent={<><br /> No hay datos para mostrar  <br /> <br /></>}
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


      {showRejectModal && (
        <div className='container-select-reject-reason' onClick={() => setShowRejectModal(false)}>
          <div className='content-select-reject-reason' onClick={(e) => e.stopPropagation()}>
            <h4>¿Por qué desea rechazar la solicitud {actualRow?.id || ""}?</h4>
            <p>Estudiante: {actualRow?.student?.name.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') || ''} - Asignatura: {actualRow?.subject?.name || ''} </p>
            <form onSubmit={handleSendRejectReason}>
              <div className='content-reason-reject-form'>
                <label> Ingrese el motivo</label>
                <input
                  type="text"
                  name="reason"
                  placeholder="Motivo del rechazo"
                  value={reasonReject}
                  maxLength={100}
                  minLength={5}
                  onChange={(e) => setReasonReject(e.target.value)}
                  required
                />
              </div>
              <div className='content-reason-reject-form-buttons'>
                <button type='button' onClick={() => { setShowRejectModal(false); setReasonReject(''); setActualRow({}) }} >Cerrar</button>
                <button type='submit' className='button-reject-send'> Solicitar </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <CustomToast
        showToast={showToast}
        setShowToast={setShowToast}
        toastMessage={toastMessage}
        toastType={toastType}
      />
    </div>
  );
}

export default PendingRequests;