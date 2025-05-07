import React, { useState, useContext, useEffect, useRef } from 'react';
import { AuthContext } from './AuthContext';
import { Navigate } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import './login.css';
import CustomToast from '../toastMessage/CustomToast';
import iconoTitle from '../../assets/icono.png';

const Login = () => {
    const { handleLogin } = useContext(AuthContext);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('');
    const [navigation, setNavigation] = useState(null);
    const [loading, setLoading] = useState(false);
    const isTokenChecked = useRef(false);
    const [dataLogin, setDataLogin] = useState({
        username: '',
        password: ''
    });

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token !== null) {
            isTokenChecked.current = true;
            setNavigation(<Navigate to="/admin/home/summary" />);
        } else {
            setNavigation(null);
        }
    }, [])

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        // setLoading(true); // Inicia la carga
        try {
            //console.log(dataLogin, "dataLogin")
            const response = await handleLogin(dataLogin.username, dataLogin.password);

            // Llama a la función de inicio de sesión
            if (response.ok) {
                const token = response.response.data.data.token;
                localStorage.setItem('authToken', token);
                console.log(response.response.data.data.token, "token de acceso")
                setNavigation(<Navigate to="/admin/home/summary" />);
            } else {
                setShowToast(true);
                // setToastMessage("Acceso denegado comuniquese con el administrador");
                setToastType('error');
                console.log(response.error.status, "error de acceso")
                if (response.error.status === 401) {
                    setToastMessage("Credenciales incorrectas. Por favor, intenta nuevamente.");
                }
                else {
                    setToastMessage(`${response.error.status} ${response.error.message}` || 'Error en la solicitud.'); // Mensaje genérico para otros errores
                }
            }

            // Almacenar el token en localStorage
            //setError(''); // Limpiar el error si todo va bien
            //console.log((jwtDecode(localStorage.getItem('authToken')).userStatus), "validacion de usuario")
            // if (jwtDecode(localStorage.getItem('authToken')).userStatus) {
            //     setNavigation(<Navigate to="/admin/welcome" />);
            // }
            // setShowToast(true);
            //setToastMessage("Acceso denegado comuniquese con el administrador");
            //setToastType('error');
            //setError("Acceso denegado comuniquese con el administrador");
        } catch (err) {
            console.error(err)
            setLoading(false);
            // setShowToast(true);
            //setToastMessage(err.message);
            // setToastType('error');
            //setError(err.message);
        } finally {
            setLoading(false); // Detiene la carga independientemente de si hubo un error o no
        }
    };

    if (isTokenChecked.current) {
        return navigation // Si el token es válido, redirige a la página de inicio
    } else {

        return (
            <div className='login-page'>
                <div className='title-login-principal'>
                    <img src={iconoTitle} alt="Icono" className="icono" />
                    <h3>SisGestión Académica</h3>
                </div>
                <div className='login-container' >
                    <div className='title-login'>
                        <h3>Iniciar Sesión</h3>
                    </div>
                    <div className='login-caption'>
                        <h4>Ingrese sus credenciales para acceder al sistema</h4>
                    </div>
                    <div className="formualrio">
                        <form onSubmit={onSubmit}>
                            <label className="username">Usuario</label>
                            <div className="form-group">
                                <input
                                    className="custom-input"
                                    placeholder="Nombre de usuario"
                                    value={dataLogin.username}
                                    onChange={(e) =>
                                        setDataLogin({
                                            ...dataLogin,
                                            username: e.target.value.replace(/\s/g, '') // Elimina todos los espacios
                                        })
                                    } maxLength={60}
                                    onKeyDown={(e) => {
                                        if (e.key === ' ') {
                                            e.preventDefault(); // Evita que se escriban espacios
                                        }
                                    }}
                                    required
                                />
                            </div>
                            <div className='resett-password row'>
                                <div className='col-5 col-md-6 contetn-label-resett-password'>
                                    <label className="password">Contraseña</label>
                                </div>

                                {/* Segunda columna */}
                                <div className='col-7 col-md-6 content-forgot-password'>
                                    <small>
                                        <a
                                            href="/forgot-password"
                                            className="forgot-password"
                                            onClick={(e) => e.preventDefault()}
                                        >
                                            ¿Olvidó su contraseña?
                                        </a>
                                    </small>
                                </div>
                            </div>

                            <div className="form-group">
                                <input
                                    type="password"
                                    value={dataLogin.password}
                                    onChange={(e) => setDataLogin({ ...dataLogin, password: e.target.value })}
                                    placeholder="Contraseña"
                                    maxLength={60}
                                    onKeyDown={(e) => {
                                        if (e.key === ' ') {
                                            e.preventDefault(); // Evita que se escriban espacios
                                        }
                                    }}
                                    required
                                />
                            </div>
                            {/* {error && <div className="alert alert-danger">{error}</div>} Mostrar el error aquí */}

                            <div className="button-container">
                                <button type="submit" className="login-btn">Ingresar</button>
                                {navigation}
                                {/* {navigation} */}
                            </div>

                        </form>

                    </div>
                    <div className="row"></div>


                </div>
                {loading && ( // Si está cargando, muestra el overlay y el spinner
                    <div className="loading-overlay">
                        <Spinner animation="grow" size="lg" /> {/* Tamaño grande para mayor visibilidad */}
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
}

export default Login;