import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation, faPeopleGroup } from '@fortawesome/free-solid-svg-icons';
import IconSelection from '../../assets/IconSelection.png';
import "./Settings.css";

function Settings() {
  return (
    <div className="settings">
      <div className='content-title'>
        <h3>Configuración</h3>
      </div>
      <div className='content-settings-app'>
        <div className='content-status-settings-app'>
          <FontAwesomeIcon className="icon-status-check-duplicates" icon={faTriangleExclamation} />
          <h3>Configuración Inicial Requerida</h3>
        </div>
        <p>Antes de comenzar a utilizar el sistema, es necesario completar la configuración inicial.</p>
      </div>

      <div className='content-update-actual-semester'>
        <img src={IconSelection} alt="Icono selecion de semestre" className="icon-settings-list" />
        <div>
          <h5>Configurar semestre</h5>
          <p>Desde esta sección puedes configurar o cambiar el semestre académico activo para la gestión.</p>
          <button>Configurar semestre</button>
        </div>
      </div>
      <div className='content-update-list-students'>
        <FontAwesomeIcon className="icon-settings-list" icon={faPeopleGroup} />
        <div>
          <h5>Listas de estudiantes para cada materia no ha sido cargada</h5>
          <p>No se han cargado las listas de estudiantes para las materias del semestre actual. Es necesario cargarlas para continuar.</p>
          <button>Cargar Listas de Estudiantes</button>
        </div>
      </div>
    </div>
  );
}

export default Settings;