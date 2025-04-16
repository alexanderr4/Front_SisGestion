import { useNavigate, Outlet } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import "./FormNewCancellation.css";

function FormNewCancellation() {
    const navigate = useNavigate();

    const hadleButtonClick = () => {
        navigate(-1)
    }
    return (
        <div className='scroll'>
            <div className='content-title'>
                <button onClick={() => hadleButtonClick()}> <FontAwesomeIcon className="icon-faArrowLeft" icon={faArrowLeft} /> </button>
                <h3>Nueva Solicitud de Cancelación</h3>
            </div>

            <div className='content-formulary'>
                <h3>Formulario de Cancelación de Asignatura</h3>
                <p>Complete los datos del estudiante y la asignatura a cancelar</p>
                <form className="formulary" >
                    <h5>Información del Estudiante</h5>
                    <div className='row'>
                        <div className='col-12 col-md-6 form-field'>
                            <label>Codigo del Etudiante</label>
                            <input
                                type="number"
                                name="codigoEstudiante"
                                placeholder="Ej: 201921257"
                                onWheel={(e) => e.target.blur()} 
                                required
                            // value={formData.nombre}
                            // onChange={handleChange}
                            />
                        </div>

                        <div className='col-12 col-md-6 form-field'>
                            <label>Nombre del Estudiante</label>
                            <input
                                type="text"
                                name="NombreEstudiante"
                                placeholder="Nombre Completo"
                            // value={formData.correo}
                            // onChange={handleChange}
                            />
                        </div>

                    </div>
                    <h5>Información de la Asignatura</h5>

                    <div className='row'>
                        <div className='col-12 col-md-6 form-field'>
                            <label>Codigo de la asignatura</label>
                            <input
                                type="text"
                                name="codigoAsignatura"
                                placeholder="Ej: ART12368"
                                required
                            // value={formData.nombre}
                            // onChange={handleChange}
                            />

                            <label>Grupo</label>
                            <input
                                type="text"
                                name="Grupo"
                                placeholder="Ej: 01"
                                required
                            // value={formData.nombre}
                            // onChange={handleChange}
                            />
                        </div>

                        <div className='col-12 col-md-6 form-field'>
                            <label>Nombre de la asignatura</label>
                            <input
                                type="text"
                                name="NombreAsignatura"
                                placeholder="Nombre de la asignatura"
                            // value={formData.correo}
                            // onChange={handleChange}
                            />

                            <label>Creditos</label>
                            <input
                                type="number"
                                name="Creditos"
                                placeholder="Ej: 3"
                                onWheel={(e) => e.target.blur()} 
                            // value={formData.correo}
                            // onChange={handleChange}
                            />
                        </div>

                    </div>

                    <div className='content-title-reason-cancellation'>
                        <h5>Motivo de Cancelación</h5>

                    </div>

                    <div className=' form-field'>
                        <label>Seleccione el motivo</label>
                        <select
                            id="desplegable"
                        // value={opcionSeleccionada}
                        // onChange={handleChange}
                        >
                            <option value="">Seleccione un motivo</option>
                            <option value="opcion1">Opción 1</option>
                            <option value="opcion2">Opción 2</option>
                            <option value="opcion3">Opción 3</option>
                        </select>

                        <label>Descripción detallada del motivo</label>
                        <textarea
                            className='input-description'
                            type="text"
                            name="Grupo"
                            placeholder="Explique detalladamente el motivo de la cancelación..."
                            required
                        // value={formData.nombre}
                        // onChange={handleChange}
                        />
                    </div>
                    {/* <div className='row'>
                        <div className='content-button-send col-md-6'>
                            <button type="submit">Enviar Solicitud</button>
                        </div>
                        <div className='content-button-cancel col-md-6'>
                            <button type="secodary">Cancelar</button>
                        </div>
                    </div> */}
                    <div className='content-buttons'>
                        <button type="secodary" className='btn-cancel'>Cancelar</button>
                        <button type="submit" className='btn-send'>Enviar Solicitud</button>
                    </div>


                </form>
            </div>

            {/* Form fields and submission logic will go here */}
        </div>
    );
}

export default FormNewCancellation;