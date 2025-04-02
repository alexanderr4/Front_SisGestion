import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faGear, faHouse, faSheetPlastic, faBookOpen, faChartColumn, faPeopleGroup, faRightFromBracket, faHardDrive, faBars, faFileLines, faScrewdriverWrench, faBuildingUser, faH } from '@fortawesome/free-solid-svg-icons';
import { Nav, Spinner } from 'react-bootstrap';
import { jwtDecode } from 'jwt-decode';
import iconoTitle from '../../assets/icono.png';
import './AdminDashboard.css';
import axios from 'axios';
import ConfirmationModal from "../ConfirmationModal/ConfirmationModal";
import { useNavigate, Outlet } from 'react-router-dom';





function AdminDashboard() {
  const [userData, setUserData] = useState({ name: '', lastName: '', email: '' });
  const [logout, setLogout] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isTokenChecked, setIsTokenChecked] = useState(false);
  const navigate = useNavigate();
  const [isMenuVisible, setMenuVisible] = useState(true);
  const [isOverlayVisible, setOverlayVisible] = useState(false);

  const loadInfoUser = async () => {
    const token = localStorage.getItem('authToken');
    let response;
    try {
      response = jwtDecode(token);
      setUserData({
        name: response.name,
        lastName: response.lastName,
      });
      return response;
    } catch (error) {
      console.error("Error al cargar los datos del usuario", error);
      return {};
    }
  }

  // useEffect(() => {
  //   try {
  //     const token = localStorage.getItem('authToken');
  //     if (token !== null && jwtDecode(token).exp * 1000 > Date.now()) {
  //       loadInfoUser();
  //       setIsTokenChecked(true);
  //     } else {
  //       localStorage.removeItem('authToken');
  //       window.location.href = '/login';
  //     }
  //   } catch (error) {
  //     console.error('Error al verificar el token:', error);
  //     localStorage.removeItem('authToken');
  //     window.location.href = '/login';
  //   }

  // }, []);

  useEffect(() => {
    const handleLogout = async () => {
      try {
        setLoading(true);  // Mostrar el spinner
        const response = await axios.get(`/users/logout`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}` // Si necesitas enviar el token de autenticación
          }
        });
        console.log('Logout successful:', response.data);
        localStorage.removeItem('authToken');  // Eliminar el token de localStorage
        console.log("sale correctamente")
        navigate('/login');    // Redirigir a la página de login
      } catch (error) {
        console.log("sale por error")
        if (error.response && error.response.status === 403) {
          console.error('Token vencido:', error);
          localStorage.removeItem('authToken');
          // Eliminar el token de localStorage
          navigate(`/login`); // Redirigir a la página de login
        } else {
          console.error('Error durante el logout:', error);
        }
      } finally {
        setLoading(false);  // Ocultar el spinner cuando termine
      }
    };








    if (logout) {
      handleLogout();
    }
  }, [logout, navigate]);



  const handleLogoutClick = () => {
    setShowLogoutModal(true);  // Mostrar el modal de confirmación
  };

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);  // Ocultar el modal
    setLogout(true);  // Iniciar el proceso de logout
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);  // Ocultar el modal sin hacer logout
  };




  const handleNavigation = async (path) => {
    if (path === '/profile-info') {
      const token = localStorage.getItem('authToken'); // Obtener el token desde el localStorage


      try {
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.id;



        const userData = {}//await getUserById(userId, token);

        // Formatear los datos recibidos
        const formattedData = {
          name: userData.name,
          lastName: userData.lastName,
          typeIdentification: userData.typeIdentification,
          numberIdentification: userData.numberIdentification,
          email: userData.email,
          phoneNumber: userData.phoneNumber,
          address: userData.address,
          pathImage: userData.pathImage,
          userStatus: userData.userStatus,
          roles: userData.roles && userData.roles.length > 0 ? userData.roles[0].name : null
        };

        console.log("Respuesta: ", formattedData);

        // Navegar y pasar los datos en el estado
        navigate(`/admin${path}`, { state: { user: formattedData } });
      } catch (error) {
        console.error("Error al cargar los datos del usuario", error);
        // Opcional: Mostrar un mensaje de error al usuario
      }
    } else if (path === '/settings') {
      const token = localStorage.getItem('authToken'); // Obtener el token desde el localStorage
      try {
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.id;
        const userData = {}//await getUserById(userId, token);
        navigate(`/admin${path}`, { state: { user: userData } });
      } catch (error) {
        console.error("Error al cargar los datos del usuario", error);
      }

    } else {
      navigate(`/admin${path}`);
    }
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



  // if (!isTokenChecked) {
  //   return null;
  // }

  return (

    <div className="container-fluid"  >
      <div className='title-principal'>
        <img src={iconoTitle} alt="Icono" className="icono" />
        <h3>SisGestión Académica</h3>
      </div>
      <div className="row custom-row">
        {/* Menú lateral */}
        <div className={`col-2 ${isMenuVisible ? '' : 'd-none'}`} style={{ minWidth: '265px', padding: 0, }}>

          <Nav className=" menuU h-100">
            <div className="section-1">

              <Nav.Link className="nav-item-custom" onClick={() => handleNavigation('/home')}>
                <FontAwesomeIcon className="icon-margin" icon={faHouse} />Inicio
              </Nav.Link>

              <Nav.Link className="nav-item-custom" onClick={() => handleNavigation('/users')}>
                <FontAwesomeIcon className="icon-margin" icon={faSheetPlastic} />        Cancelaciones
              </Nav.Link>

              <Nav.Link className="nav-item-custom" onClick={() => handleNavigation('/equipments')}>
                <FontAwesomeIcon className="icon-margin" icon={faBookOpen} />
                Electivas
              </Nav.Link>
              <Nav.Link className="nav-item-custom" onClick={() => handleNavigation('/clients')}>
                <FontAwesomeIcon className="icon-margin" icon={faChartColumn} />
                Reportes
              </Nav.Link>
              <Nav.Link className="nav-item-custom" onClick={() => handleNavigation('/requestMaintenance')}>
                <FontAwesomeIcon className="icon-margin" icon={faPeopleGroup} />Estudiantes
              </Nav.Link>

              <Nav.Link className="nav-item-custom" onClick={() => handleNavigation('/settings')}>

                <FontAwesomeIcon className="icon-margin" icon={faGear} />Configuración
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
        title="Cierre de Sesión"
        bodyText="¿Estás seguro de que deseas cerrar sesión?"
        confirmText={loading ? <Spinner animation="border" size="sm" /> : "Sí"}
        cancelText="No"
        containerId="modal-container"
      />


    </div>
  );
};

export default AdminDashboard;