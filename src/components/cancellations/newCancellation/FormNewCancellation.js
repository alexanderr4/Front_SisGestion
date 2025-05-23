import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import ConfirmationModal from "../../ConfirmationModal/ConfirmationModal";
import { Nav, Spinner } from 'react-bootstrap';
import "./FormNewCancellation.css";
import AutoCompleteInput from './AutoCompleteInput ';



function FormNewCancellation({
    handleInputChange,
    handleSubmit,
    loadData,
    optionStundent,
    setOptionStudent,
    setOptionAsignature,
    optionAsignature,
    mapNameStudent,
    mapNameSubjects,
    loading,
    hadleButtonClickBack,
    handleCancel,
    showModal,
    handleCloseModal,
    handleConfirmAction,
    modalType }) {

    const [activeTabStudent, setActiveTabStudent] = useState("studentCode");
    const [activeTabAsignature, setActiveTabAsignature] = useState("AsignatureCode");
    const options = ['Bajo rendimiento académico', 'Conflicto de horario', 'Problemas de salud', "Motivos personales", "Compromisos laborales", "Dificultades económicas", "Dificultades con la metodología del curso", "Otro motivo"];
    const [selectedOption, setSelectedOption] = useState('');

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
                        <div className='content-sub-menu-cance'>
                            <Nav className='custom-sub-menu' variant="tabs" activeKey={activeTabStudent} onSelect={(selectedKey) => setActiveTabStudent(selectedKey)}>
                                <Nav.Item>
                                    <Nav.Link eventKey="studentCode" onClick={() => setOptionStudent(true)}>Buscar por Código</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="studentName" onClick={() => setOptionStudent(false)}>Buscar por Nombre</Nav.Link>
                                </Nav.Item>

                            </Nav>
                        </div>
                        {optionStundent ? (<div className=' form-field'>
                            <AutoCompleteInput
                                label="Código del Etudiante"
                                name="student"
                                value={loadData.student}
                                onChange={handleInputChange}
                                options={mapNameStudent()}
                                searchField="code"
                                type={"number"}
                                placeholder={"estudiante por código"}
                            />

                        </div>) : (
                            <div className='form-field'>
                                <AutoCompleteInput
                                    label="Nombre del Estudiante"
                                    name="student"
                                    value={loadData.student}
                                    onChange={handleInputChange}
                                    options={mapNameStudent()}
                                    searchField="name"
                                    type={"text"}
                                    placeholder={"estudiante por nombre"}
                                />
                            </div>
                        )}
                    </div>
                    <h5>Información de la Asignatura</h5>

                    <div className='row'>
                        <div className='content-sub-menu-cance'>
                            <Nav className='custom-sub-menu' variant="tabs" activeKey={activeTabAsignature} onSelect={(selectedKey) => setActiveTabAsignature(selectedKey)}>
                                <Nav.Item>
                                    <Nav.Link eventKey="AsignatureCode" onClick={() => setOptionAsignature(true)}>Buscar por Código</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="AsignatureName" onClick={() => setOptionAsignature(false)} >Buscar por Nombre</Nav.Link>
                                </Nav.Item>

                            </Nav>
                        </div>
                        {optionAsignature ? (
                            <div className='form-field'>
                                <AutoCompleteInput
                                    label="Codigo de la asignatura"
                                    name="subject"
                                    value={loadData.subject}
                                    onChange={handleInputChange}
                                    options={mapNameSubjects()}
                                    searchField="code"
                                    type={"number"}
                                    placeholder={"materia por código"}
                                />
                            </div>

                        ) : (
                            <div className='form-field'>

                                <AutoCompleteInput
                                    label="Nombre de la asignatura"
                                    name="subject"
                                    value={loadData.subject}
                                    onChange={handleInputChange}
                                    options={mapNameSubjects()}
                                    searchField="name"
                                    type={"text"}
                                    placeholder={"materia por nombre"}
                                />
                            </div>
                        )}
                    </div>

                    <div className='content-title-reason-cancellation'>
                        <h5>Motivo de Cancelación</h5>

                    </div>

                    <div className=' form-field'>
                        <label>Seleccione el motivo</label>
                        {options.map((option, index) => (
                            <div>
                                <label key={index} className="radio-container">
                                    <input
                                        type="radio"
                                        name="justification"
                                        value={option}
                                        checked={loadData.justification === option}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    {option}
                                </label>
                            </div>
                        ))}

                        <div className='content-description'>
                            <label>Descripción detallada del motivo (Opcional)</label>
                            <textarea
                                className='input-description'
                                type="text"
                                name="comments"
                                id='descripcion'
                                placeholder="Explique detalladamente el motivo de la cancelación..."
                                value={loadData.comments}
                                onChange={handleInputChange}

                            // value={formData.nombre}
                            // onChange={handleChange}
                            />
                        </div>

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