import React, { use, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear, faHouse, faSheetPlastic, faBookOpen, faChartColumn, faBars, faRightFromBracket, faTruckField} from '@fortawesome/free-solid-svg-icons';
import { Nav, Spinner } from 'react-bootstrap';
import { jwtDecode } from 'jwt-decode';
import iconoTitle from '../../assets/icono.png';
import IconSelection from '../../assets/IconSelection.png';
import iconPaperCancell from '../../assets/icon-paper-cancell.svg';
import './AdminDashboard.css';
import ConfirmationModal from "../ConfirmationModal/ConfirmationModal";
import { useNavigate, Outlet } from 'react-router-dom';





function AdminDashboard() {

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isTokenChecked, setIsTokenChecked] = useState(false);
  const [logoutClicked, setLogoutClicked] = useState(false);
  const navigate = useNavigate();
  const [isMenuVisible, setMenuVisible] = useState(true);
  const [isOverlayVisible, setOverlayVisible] = useState(false);
  const pathInitial = window.location.pathname;

  useEffect(() => {
    try {
      console.log('Token:', localStorage.getItem('authToken'));
      const token = localStorage.getItem('authToken');
      
      const pathSegments = window.location.pathname.split('/').filter(Boolean);
      if (token !== null && jwtDecode(token).exp * 1000 > Date.now()) {
        setIsTokenChecked(true);
        if (localStorage.getItem('actualSemester') === null) {
          localStorage.setItem('actualSemester', '2025-1');
        }
        if (pathSegments[0] === 'admin' && pathSegments.length === 1) {
          navigate('/admin/home/summary');
        }
      } else {
        localStorage.removeItem('authToken');
        localStorage.removeItem('actualSemester');
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Error al verificar el token:', error);
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }

  },[pathInitial]);


  useEffect(() => {
    if (logoutClicked) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
  }, [logoutClicked]);





  const handleCancelLogout = () => {
    setShowLogoutModal(false);  // Ocultar el modal sin hacer logout
  };




  const handleNavigation = async (path) => {
    navigate(`/admin${path}`, { state: { key: Date.now() } });
  };


  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMenuVisible(true);
        setOverlayVisible(false);
      } else if (isMenuVisible) {
        setOverlayVisible(true);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [isMenuVisible]);


  const toggleMenu = () => {
    setMenuVisible((prevState) => {
      const newMenuState = !prevState;
      if (newMenuState && window.innerWidth < 768) {
        setOverlayVisible(true);
      } else {
        setOverlayVisible(false);
      }
      return newMenuState;
    });
  };

  const handleConfirmLogout = () => {
    setLoading(true); 
    setLogoutClicked(true);
  //   localStorage.removeItem('authToken');
  //  // window.location.reload();
  //   window.location.href = '/login';
  }

  if (!isTokenChecked) {
    return null;
  }

  return (

    <div className="container-fluid"  >
      <div className='content-current-semester row'>
        <div className='seccion-current-semester col-12 col-md-8'>
          <img src={IconSelection} alt="Icono selecion de semestre" className="icon-current-semester" />
          <h3>Semestre Actual:</h3>
          <div className='current-semester'>
            <h3>{localStorage.getItem('actualSemester')}</h3>
          </div>
        </div>
        <div className='button-current-semester col-12 col-md-3'>
          <button onClick={() => handleNavigation('/settings/updateActualSemester')}>Cambiar</button>
        </div>

      </div>
      <div className='title-principal'>
        <img src={iconoTitle} alt="Icono" className="icono" />
        <h3>SisGestión Académica</h3>
      </div>
      <div className="row custom-row">
        {/* Menú lateral */}
        <div className={`col-2 ${isMenuVisible ? '' : 'd-none'}`} style={{ minWidth: '265px', padding: 0, }}>

          <Nav className=" menuU h-100">
            <div className="section-1">

              <Nav.Link className="nav-item-custom" onClick={() => handleNavigation('/home/summary')}>
                <FontAwesomeIcon className="icon-margin" icon={faHouse} />Inicio
              </Nav.Link>

              <Nav.Link className="nav-item-custom" onClick={() => handleNavigation('/cancellations/cancellationManagement')}>
                <img src={iconPaperCancell} alt="icono cancelaciones" width="19" height="19" />     Cancelaciones
              </Nav.Link>

              <Nav.Link className="nav-item-custom" onClick={() => handleNavigation('/electives/electiveManagement')}>
                <FontAwesomeIcon className="icon-margin" icon={faBookOpen} />
                Electivas
              </Nav.Link>

              <Nav.Link className="nav-item-custom" onClick={() => handleNavigation('/reports/reportsAndStatistics')}>
                <FontAwesomeIcon className="icon-margin" icon={faChartColumn} />
                Reportes
              </Nav.Link>

              <Nav.Link className="nav-item-custom" onClick={() => handleNavigation('/subjectManagement')}>
                <FontAwesomeIcon className="icon-margin" icon={faSheetPlastic} />Materias
              </Nav.Link>

              <Nav.Link className="nav-item-custom" onClick={() => handleNavigation('/settings')}>

                <FontAwesomeIcon className="icon-margin" icon={faGear} />Configuración
              </Nav.Link>
              <Nav.Link className="nav-item-custom"onClick={() => setShowLogoutModal(corrent => true)}>

                <FontAwesomeIcon className="icon-margin" icon={faRightFromBracket}/>Cerrar Sesión
              </Nav.Link>
              {/* <div className="separator-line" /> */}
            </div>

            {/* <div className="section-2">
              <div className="separator-line" />
              <Nav.Link className='profile-header-user' onClick={() => handleNavigation('/profile-info')}>
                <img src={userData.pathImage} alt="Admin" className="profile-img-user" />
                <div className="title-profile">
                  <h5 className="profile-title-user">{userData.name} {userData.lastName}</h5>
                  <p className="profile-subtitle-user">{userData.email}</p>
                </div>
              </Nav.Link>
            </div> */}

            {/* <div className="section-3">

              <Nav.Link className="nav-item-custom" onClick={() => handleNavigation('/settings')}>

                <FontAwesomeIcon className="icon-margin" icon={faGear} />
                Configuración
              </Nav.Link>

              <Nav.Link className="nav-item-custom" onClick={handleLogoutClick}>
                <FontAwesomeIcon className="icon-margin" icon={faRightFromBracket} />
                Cerrar Sesión
              </Nav.Link>
            </div> */}
          </Nav>


        </div>


        {/* Contenido principal */}

        <div className="col custom-col">
          <div className="row ">

            <div className="col-12  top-bar d-md-none">
              <button className=" menu-button col-2" onClick={toggleMenu}>
                <FontAwesomeIcon className="icon-margin" icon={faBars} />
              </button>
            </div >

            <div className='col-12 container-content-scrollable'>
              <Outlet />
            </div>
          </div>

          <div className={`content-overlay ${isOverlayVisible ? 'visible' : ''}`} onClick={toggleMenu}></div>
        </div>
      </div>





      {/* Modal de confirmación de cierre de sesión */}
      <ConfirmationModal
        show={showLogoutModal}
        onHide={handleCancelLogout}
        onConfirm={handleConfirmLogout}
        title="Cerrar Sesión"
        bodyText="¿Estás seguro de que deseas cerrar sesión?"
        confirmText={loading ? <Spinner animation="border" size="sm" /> : "Sí"}
        cancelText="No"
        containerId="modal-container"
      />


    </div>
  );
};

export default AdminDashboard;