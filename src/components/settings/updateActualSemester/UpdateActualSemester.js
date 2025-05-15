import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import DatePicker from 'react-datepicker';
import { registerLocale } from "react-datepicker";
import es from "date-fns/locale/es";
import IconSelection from '../../../assets/IconSelection.png';
import { getDatesSemester } from '../../util/Util';
import ConfirmationModal from '../../ConfirmationModal/ConfirmationModal';
import CustomToast from '../../toastMessage/CustomToast';
import './UpdateActualSemester.css';


registerLocale("es", es);

function UpdateActualSemester() {

    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [semester, setSemester] = useState("");
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('');
    const [showConfirmation, setShowConfirmation] = useState(false);

    const handleCloseModal = () => {
        setShowModal(false);
    }


    const handleChange = (e) => {
        setSemester(e.target.value);
    };

    const handleConfirmAction = () => {
        setShowModal(false);
        localStorage.setItem('actualSemester', `${selectedDate.getFullYear()}-${semester}`);
        setToastMessage('Semestre actualizado correctamente');
        setToastType('success');
        setShowToast(true);
        setShowConfirmation(true);
        setTimeout(() => {
           window.location.reload();
        }, 1000);
    }

    const hendleUpdate = (e) => {
        e.preventDefault();
        setShowModal(true);
    }

    const hadleButtonClickBack = () => {
        navigate(-1);
    }

    const dateCreated = () => {
        try {
            const { startDate, endDate } = getDatesSemester();
            return { startSemester: `${startDate.toLocaleString('es-ES', { month: 'long' })} ${startDate.getFullYear()}`, endSemester: `${endDate.toLocaleString('es-ES', { month: 'long' })} ${endDate.getFullYear()}` };
        } catch (error) {
            console.error("Error al obtener las fechas del semestre:", error);
            return { startSemester: '', endSemester: '' };
        }

    }

    return (
        <div>
            <div className='content-title'>
                <button onClick={() => hadleButtonClickBack()}> <FontAwesomeIcon className="icon-faArrowLeft" icon={faArrowLeft} /> </button>
                <h3>Configuración de Semestre Académico</h3>
            </div>
            <div className='container-content-settings'>
                <h3>Semestre Académico Actual</h3>
                <p>Configure el semestre académico actual del sistema</p>
                <div className='container-show-actual-semester'>
                    <img src={IconSelection} alt="Icono selecion de semestre" className="icon-settings-list" />
                    <div>
                        <h5>Semestre Actual: {localStorage.getItem('actualSemester')} </h5>
                        <p>Período: {dateCreated().startSemester} - {dateCreated().endSemester} </p>
                    </div>
                </div>
                <div className='container-form-settings'>
                    <form onSubmit={hendleUpdate}>
                        <h5>Cambiar Semestre</h5>
                        <div className='row'>
                            <div className='col-12 col-md-6 date-picker-wrapper'>
                                <label>Año</label>
                                <DatePicker
                                    selected={selectedDate}
                                    onChange={(date) => setSelectedDate(date)}
                                    showYearPicker
                                    dateFormat="yyyy"
                                    placeholderText="Selecciona un año"
                                    popperPlacement="bottom-start"
                                    required
                                    locale="es"
                                    renderCustomHeader={({
                                        decreaseYear,
                                        increaseYear,
                                        prevYearButtonDisabled,
                                        nextYearButtonDisabled,
                                    }) => (
                                        <div className='cotainer-buttons-calendar'>
                                            <button type="button" onClick={decreaseYear} disabled={prevYearButtonDisabled}>
                                                Año anterior
                                            </button>
                                            <button type="button" onClick={increaseYear} disabled={nextYearButtonDisabled}>
                                                Año siguiente
                                            </button>
                                        </div>
                                    )}
                                />
                            </div>
                            <div className='col-12 col-md-6 checkbox-options'>
                                <label>Periodo</label>
                                <div className="form-check">
                                    <label className="radio-container">
                                        <input
                                            type="radio"
                                            name="opcion"
                                            id="op1"
                                            value="1"
                                            checked={semester === "1"}
                                            onChange={handleChange}
                                            required
                                        />
                                        1(Enero - Junio)</label>
                                    <label className="radio-container">
                                        <input type="radio"
                                            name="opcion"
                                            id="op2"
                                            value="2"
                                            checked={semester === "2"}
                                            onChange={handleChange}
                                        />
                                        2(Julio - Diciembre)</label>
                                </div>
                            </div>
                        </div>
                        <div className='container-button-update-settings'>
                            <button type='button' className='btn-cancel-settings' disabled = {showConfirmation} onClick={() => {navigate(-1 )}}>Cancelar</button>
                            <button className='btn-save-settings' disabled ={showConfirmation}>Actualizar Semestre</button>
                        </div>
                    </form>
                </div>
            </div>
            <ConfirmationModal
                show={showModal}
                onHide={handleCloseModal}
                onConfirm={handleConfirmAction}
                title={"Confirmar registro"}
                bodyText={"¿Estás seguro de que deseas cargar los estudiantes?"}
                confirmText={"Sí"}
                cancelText="No"
                containerId="modal-container"
            />
            <CustomToast
                showToast={showToast}
                setShowToast={setShowToast}
                toastMessage={toastMessage}
                toastType={toastType}
            />
        </div>
    );
}

export default UpdateActualSemester;