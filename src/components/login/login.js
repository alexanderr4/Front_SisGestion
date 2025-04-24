import React, { useState, useContext } from 'react';
import './login.css';

import iconoTitle from '../../assets/icono.png';

const Login = () => {
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
                    <form>
                        <label className="username">Usuario</label>
                        <div className="form-group">
                            <input
                            className="custom-input"
                                placeholder="Nombre de usuario"
                                //   value={userName}
                                //   onChange={(e) => setEmail(e.target.value)}
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
                                //   value={password}
                                //   onChange={(e) => setPassword(e.target.value)}
                                placeholder="Contraseña"
                               
                                required
                            />
                        </div>
                        {/* {error && <div className="alert alert-danger">{error}</div>} Mostrar el error aquí */}

                        <div className="button-container">
                            <button type="submit" className="login-btn">Ingresar</button>
                            {/* {navigation} */}
                        </div>

                    </form>

                </div>
                <div className="row"></div>


            </div>

        </div>
    );
}

export default Login;