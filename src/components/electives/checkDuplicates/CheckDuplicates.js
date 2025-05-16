import { useRef, useState } from 'react';
import DataTable from 'react-data-table-component';
import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faTriangleExclamation, faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import ConfirmationModal from '../../ConfirmationModal/ConfirmationModal';
import CustomToast from '../../toastMessage/CustomToast';
import { getElectives, getStudentsBySubject } from '../../../api/Subjects';
import { getDatesSemester } from '../../util/Util';
import "./CheckDuplicates.css";


function CheckDuplicates({ electives }) {
  const navigate = useNavigate();
  const dataElectives = useRef([]);
  const [dataElectivesByStudents, setDataElectivesByStudents] = useState([]);
  const [check, setCheck] = useState(false);
  const [countElectives, setCountElectives] = useState(0);
  const [duplicatedStudents, setDuplicatedStudents] = useState([]);
  const [actualRow, setActualRow] = useState({});
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('');

  useEffect(() => {
    const fetch = async () => {
      await loadSubjects();
      loadEnrollments();
    }
    fetch();

  }, [check])

  useEffect(() => {
    getStudentsInMultipleSubjects()
  }, [dataElectivesByStudents])

  const loadSubjects = async () => {
    setLoading(true);
    const { startDate, endDate } = getDatesSemester();
    await getElectives().then((response) => {
      dataElectives.current = response.data.data.filter(subject => { return new Date(subject.created_at) >= startDate && new Date(subject.created_at) <= endDate });
    }).catch((error) => {
      console.error("Error validate fetching subjects:", error);
      dataElectives.current = [];
      setShowToast(true);
      setToastMessage(`${error.status} Error al cargar las materias`);
      setToastType("error");
    });
  }


  const hadleButtonClickBack = () => {
    navigate(-1);
  }

  const loadEnrollments = async () => {
    setLoading(true);
    if (dataElectives.current.length > 0) {
      const promises = dataElectives.current.map(async (subject) => {
        try {
          const response = await getStudentsBySubject(subject.id, '?page=1&page_size=100');
          return { ...subject, students: response.data.data.data };
        } catch (error) {
          console.error("Error fetching students by subject:", error);
          return { ...subject, students: [] }; // o maneja como prefieras
        }
      });
      setDataElectivesByStudents(await Promise.all(promises));
    }
  };

  const getStudentsInMultipleSubjects = () => {
    const studentMap = new Map();
    dataElectivesByStudents.forEach(subject => {
      subject.students.forEach(({ student }) => {
        const existing = studentMap.get(student.id);
        if (existing) {
          existing.subjects.push(subject);
        } else {
          studentMap.set(student.id, {
            student,
            subjects: [subject]
          });
        }
      });
    });
    const result = Array.from(studentMap.values()).filter(entry => entry.subjects.length >= 2);
    if (!localStorage.getItem("ElectivesDuplicate")) {
      setDuplicatedStudents(current => { return result });
      setCountElectives(result.length);
    } else {
      const localStorageData = JSON.parse(localStorage.getItem("ElectivesDuplicate"));
      const setLista2 = new Set(localStorageData.map(obj => JSON.stringify(obj)));
      const resultado = result.filter(obj => !setLista2.has(JSON.stringify(obj)));
      setCountElectives(resultado.length);
      setDuplicatedStudents(current => { return resultado });
    }
    setLoading(false);
  }

  const handleToSolve = (row) => {
    setActualRow(row);
    setShowModal(true);
  }

  const handleCloseModal = () => {
    setShowModal(false);
  }
  const handleConfirmAction = () => {
    setShowModal(false);
    if (localStorage.getItem("ElectivesDuplicate")) {
      console.log("row", actualRow);
      const listaActual = JSON.parse(localStorage.getItem("ElectivesDuplicate")) || [];
      listaActual.push(actualRow);
      localStorage.setItem("ElectivesDuplicate", JSON.stringify(listaActual));
    } else {
      localStorage.setItem("ElectivesDuplicate", JSON.stringify([actualRow]));
    }
    setToastMessage("Se ha marcado como resuelto");
    setToastType("success");
    setShowToast(true);
    setCheck(curret => { return !curret });
  }

  const columnsTable = [
    {
      name: 'codigo del estudiante',
      selector: row => row.student.code,
      sortable: true,
      grow: 0.1
    },
    {
      name: 'Nombre',
      selector: row => row.student.name,
      sortable: true,
      grow: 1.2
    },
    {
      name: 'Electivas Inscritas',
      //selector: row => row.subjects.map(subject => subject.name).join(', '),
      cell: row => <div className="repeated-subjects-container">
        <div className="subject-list">
          {row.subjects.map(subject => (
            <div key={subject.id} className="subject-card">
              <strong></strong>
              <p>{subject.code}-{subject.name}</p>
            </div>
          ))}
        </div>
      </div>,
      grow: 1.4
    },
    {
      name: 'Semestres',
      selector: row => row.subjects.map(subject => subject.semester).join(', '),
      grow: 0.1
    },
    {
      name: 'Accion',
      cell: (row) => <div className='content-button-check-duplicates'>
        <button onClick={() => handleToSolve(row)}>Resuelto</button>
      </div>
    }


  ]


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
        {countElectives > 0 ? (
          <>
            <div className='content-status-check-duplicates'>
              <FontAwesomeIcon className="icon-status-check-duplicates" icon={faTriangleExclamation} />
              <h3>Atención</h3>
            </div>
            <p>Se han encontrado {countElectives} estudiantes con inscripciones duplicadas de electivas.</p>
          </>
        ) : (
          <>
            <div className='content-status-check-duplicates'>
              <FontAwesomeIcon className="icon-status-check-duplicates" icon={faCircleCheck} />
              <h3>Todo esta bien</h3>
            </div>
            <p>No se encontraron inscripciones duplicadas. Puedes continuar con tranquilidad.</p>
          </>
        )}


      </div>
      <div className='title-and-text-check-duplicates'>
        <h3>Electivas Duplicadas</h3>
        <p>Estudiantes que tienen inscritas dos o más electivas del mismo semestre</p>
        <div className={`number-check-duplicates-${countElectives > 0 ? 'red' : 'green'}`}>
          {countElectives} Duplicados encontrados
        </div>
        <div className='content-table-check-duplicates'>
          <DataTable
            customStyles={customStyles}
            columns={columnsTable}
            data={duplicatedStudents}
            fixedHeader
            fixedHeaderScrollHeight={"calc(100vh - 210px)"}
            noDataComponent={<><br /> No hay datos para mostrar  <br /> <br /></>}
            progressPending={loading}
            progressComponent={(
              <div className="loading-overlay-table">
                <Spinner animation="border" size="lg" />
              </div>
            )}
          />
        </div>
      </div>
      <CustomToast
        showToast={showToast}
        setShowToast={setShowToast}
        toastMessage={toastMessage}
        toastType={toastType}
      />
      <ConfirmationModal
        show={showModal}
        onHide={handleCloseModal}
        onConfirm={handleConfirmAction}
        title={"Confirmar resolución"}
        bodyText={"¿Estás seguro de que deseas marcar como resuelto?"}
        confirmText={"Sí"}
        cancelText="No"
        containerId="modal-container"
      />
    </div>
  );
}

export default CheckDuplicates;