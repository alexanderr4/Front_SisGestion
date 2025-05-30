import { useState, useEffect, use } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation, faPeopleGroup } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, Outlet } from 'react-router-dom';
import IconSelection from '../../assets/IconSelection.png';
import CustomToast from '../toastMessage/CustomToast';
import { getSubjectBySemester } from '../../api/Subjects';
import { getEnrollmentsBySubject } from '../../api/Students';
import { getDatesSemester } from '../util/Util';
import { Spinner } from 'react-bootstrap';
import "./Settings.css";

function Settings() {
  const navigate = useNavigate();
  const pathInitial = window.location.pathname;
  const [paintNewComponent, setPaintNewComponent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifyNumberStudents, setVerifyNumberStudents] = useState(false);
  const [subjectData, setSubjectData] = useState([]);
  const [showToast, setShowToast] = useState(false);     // Estado para mostrar/ocultar el Toast
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('');


  useEffect(() => {
    if (pathInitial === "/admin/settings") {
      setPaintNewComponent(current => { return false });
    }
    if (window.location.pathname === "/admin/settings/updateActualSemester") {
      setPaintNewComponent(current => { return true });
    }
  }, [pathInitial]);

  useEffect(() => {
    const fetchLoadData = async () => {
      let h = []
      for (let i = 1; i < 11; i++) {
        const subjects = await loadSubjects(i);
        h = [...h, ...subjects];
        //setSubjectData(current => { return [...current, subjects] });
      }
      setSubjectData(h);
    }

    fetchLoadData();
  }, []);

  useEffect(() => {
    const fetchVerifyStudents = async () => {
      setLoading(true);
      try {
        let verify = false;
        let count = 0;
        while (verify === false) {
          const subjectStudents = await loadVerifyStudents(subjectData[count].id);
          console.log("subjectStudents", subjectStudents);
          if (subjectStudents.length > 0) {
            console.log("hola", subjectStudents.length > 0)
            verify = true;
            setLoading(false);
          }
          count++;
        }
        setVerifyNumberStudents(current => { return verify });
      } catch (error) {
        setVerifyNumberStudents(false);
      }
    };

    if (subjectData?.length > 0) {
    fetchVerifyStudents();
    } else { setLoading(current => { return false }) }
  }, [subjectData]);

  console.log("subjectData", verifyNumberStudents);

  const loadSubjects = async (semester) => {
    setLoading(true);
    const { startDate, endDate } = getDatesSemester();
    try {
      const res = await getSubjectBySemester(semester);
      const filteredSubjectsBySemesters = res.data.data.filter((subject) => new Date(subject.created_at) >= startDate && new Date(subject.created_at) <= endDate);
      return filteredSubjectsBySemesters;
    } catch (error) {
      setLoading(false);
      console.error("Error fetching subjects:", error);
      typeof error.status !== 'undefined' ? setShowToast(true) : setShowToast(false);
      setToastMessage(`${error.status} Error al cargar los datos`);
      setToastType('error');
      return []
    }
  }

  const loadVerifyStudents = async (id) => {
    setLoading(true);
    try {
      if (id) {
        const response = await getEnrollmentsBySubject(id, '?page=1&page_size=90');
        return response.data.data.data;
      }
    } catch (error) {
      console.error("Error al obtener los enrollments:", error);
      setLoading(false)
      return [];
    } finally {
      //setLoading(false);
    }
  }



  const handleConfigSemester = () => {
    navigate('/admin/settings/updateActualSemester');
    setPaintNewComponent(current => { return true });
  }

  const handleSubject = () => {
    navigate('/admin/subjectManagement');

  }

  if (paintNewComponent) {
    return (
      <Outlet />
    )
  }

  return (
    <div className="settings">
      <div className='content-title'>
        <h3>Configuración</h3>
      </div>
      {verifyNumberStudents && (
        <div className='content-settings-app'>
          <div className='content-status-settings-app'>
            <FontAwesomeIcon className="icon-status-check-duplicates" icon={faTriangleExclamation} />
            <h3>Configuración Inicial Requerida</h3>
          </div>
          <p>Antes de comenzar a utilizar el sistema, es necesario completar la configuración inicial.</p>
        </div>
      )}

      <div className='content-update-actual-semester'>
        <img src={IconSelection} alt="Icono selecion de semestre" className="icon-settings-list" />
        <div>
          <h5>Configurar semestre</h5>
          <p>Desde esta sección puedes configurar o cambiar el semestre académico activo para la gestión.</p>
          <button onClick={handleConfigSemester}>Configurar semestre</button>
        </div>
      </div>
      <div className={`content-update-list-students ${!verifyNumberStudents ? 'color-accepted' : ''}`}>
        {!verifyNumberStudents === true ? (
          <>
            <FontAwesomeIcon className="icon-settings-list" icon={faPeopleGroup} />
            <div>
              <h5>Listas de estudiantes cargadas correctamente</h5>
              <p>Las listas de estudiantes para las materias del semestre actual ya han sido cargadas exitosamente. Puedes continuar con el proceso.</p>
              <button onClick={handleSubject}>Volver a cargar listas</button>
            </div>
          </>
        ) : (
          <>
            <FontAwesomeIcon className="icon-settings-list" icon={faPeopleGroup} />
            <div>
              <h5>Listas de estudiantes para cada materia no ha sido cargada</h5>
              <p>No se han cargado las listas de estudiantes para las materias del semestre actual. Es necesario cargarlas para continuar.</p>
              <button onClick={handleSubject}>Cargar Listas de Estudiantes</button>
            </div>
          </>
        )}

      </div>
      {loading && (
        <div className="loading-overlay">
          <Spinner animation="grow" role="status">
            <span className="visually-hidden">Cargando...</span>
          </Spinner>
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

export default Settings;