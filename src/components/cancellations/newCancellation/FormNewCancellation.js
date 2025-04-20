import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import ConfirmationModal from "../../ConfirmationModal/ConfirmationModal";
import { Spinner } from 'react-bootstrap';
import "./FormNewCancellation.css";

function FormNewCancellation({ formData,
    setFormData,
    handleInputChange,
    handleSubmit,
    loadData,
    setLoadData,
    getRootProps,
    getInputProps,
    isDragActive,
    image,
    loading,
    hadleButtonClickBack,
    handleCancel,
    handleRegister,
    showModal,
    handleCloseModal,
    handleConfirmAction,
    isEditingButtons,
    modalType }) {

    return (
        <div className='content-new-cancellation'>
            <div className='content-title'>
                <button onClick={() => hadleButtonClickBack()}> <FontAwesomeIcon className="icon-faArrowLeft" icon={faArrowLeft} /> </button>
                <h3>Nueva Solicitud de Cancelación</h3>
            </div>


            <div className='content-formulary'>
                <h3>Formulario de Cancelación de Asignatura</h3>
                <p>Complete los datos del estudiante y la asignatura a cancelar</p>
                <form className="formulary" onSubmit={handleSubmit} >
                    <h5>Información del Estudiante</h5>
                    <div className='row'>
                        <div className='col-12 col-md-6 form-field'>
                            <label>Codigo del Etudiante</label>
                            <input
                                type="number"
                                name="codigoEstudiante"
                                id='codigoEstudiante'
                                placeholder="Ej: 201921257"
                                value={loadData.codigoEstudiante}
                                onChange={handleInputChange}
                                onWheel={(e) => e.target.blur()}
                                onKeyDown={(e) => {
                                    if (['e', 'E', '+', '-'].includes(e.key)) {
                                        e.preventDefault();
                                    }
                                }}
                                required
                            // value={formData.nombre}
                            // onChange={handleChange}
                            />
                        </div>

                        <div className='col-12 col-md-6 form-field'>
                            <label>Nombre del Estudiante</label>
                            <input
                                type="text"
                                name="nombreEstudiante"
                                id='nombreEstudiante'
                                placeholder="Nombre Completo"
                                onChange={handleInputChange}
                                value={loadData.nombreEstudiante}

                                required
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
                                id='codigoAsignatura'
                                placeholder="Ej: ART12368"
                                value={loadData.codigoAsignatura}
                                onChange={handleInputChange}
                                required
                            // value={formData.nombre}
                            // onChange={handleChange}
                            />

                            <label>Grupo</label>
                            <input
                                type="text"
                                name="grupoAsignatura"
                                id='grupoAsignatura'
                                placeholder="Ej: 01"
                                value={loadData.grupoAsignatura}
                                onChange={handleInputChange}
                                required
                            // value={formData.nombre}
                            // onChange={handleChange}
                            />
                        </div>

                        <div className='col-12 col-md-6 form-field'>
                            <label>Nombre de la asignatura</label>
                            <input
                                type="text"
                                name="nombreAsignatura"
                                id='nombreAsignatura'
                                placeholder="Nombre de la asignatura"
                                value={loadData.nombreAsignatura}
                                onChange={handleInputChange}
                                required
                            // value={formData.correo}
                            // onChange={handleChange}
                            />

                            <label>Creditos</label>
                            <input
                                type="number"
                                name="creditosAsignatura"
                                id='creditosAsignatura'
                                placeholder="Ej: 3"
                                onWheel={(e) => e.target.blur()}
                                value={loadData.creditosAsignatura}
                                onChange={handleInputChange}
                                onKeyDown={(e) => {
                                    if (['e', 'E', '+', '-'].includes(e.key)) {
                                        e.preventDefault();
                                    }
                                }}
                                required
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
                        <select id="desplegable"
                            name='tipeAsignatura'

                            value={loadData.tipeAsignatura}
                            onChange={handleInputChange}
                            required
                        // value={opcionSeleccionada}
                        // onChange={handleChange}
                        >
                            <option value="" disabled>Seleccione un motivo</option>
                            <option value="opcion1">Opción 1</option>
                            <option value="opcion2">Opción 2</option>
                            <option value="opcion3">Opción 3</option>
                        </select>

                        <label>Descripción detallada del motivo</label>
                        <textarea
                            className='input-description'
                            type="text"
                            name="descripcion"
                            id='descripcion'
                            placeholder="Explique detalladamente el motivo de la cancelación..."
                            value={loadData.descripcion}
                            onChange={handleInputChange}
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
                        <button type='button' className='btn-cancel' onClick={handleCancel}>
                            {loading ? (<Spinner animation="border" size="sm" />) : ("Cancelar")}
                        </button>
                        <button type="submit" className='btn-send'>
                            {loading ? (<div><Spinner animation="border" size="sm" /></div>) : ("Enviar Solicitud")}
                        </button>
                    </div>

                   

                </form>

                {loading && (
                        <div className="loading-overlay">
                            <Spinner animation="grow" role="status">
                                <span className="visually-hidden">Cargando...</span>
                            </Spinner>
                        </div>
                    )}
            </div>
            <ConfirmationModal
                show={showModal}
                onHide={handleCloseModal}
                onConfirm={handleConfirmAction}
                title={modalType === 'cancel' ? "Cancelar registro" : "Confirmar registro"}
                bodyText={modalType === 'cancel'
                    ? "¿Estás seguro de que deseas cancelar el registro? Se perderán todos los datos."
                    : "¿Estás seguro de que deseas registrar la nueva solicitud de cancelación?"}
                confirmText={modalType === 'cancel' ? "Sí" : "Sí"}
                cancelText="No"
                containerId="modal-container"
            />
        </div >
    );
}

export default FormNewCancellation;