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
        <div>
            <div className='content-title'>
                <button onClick={() => hadleButtonClick()}> <FontAwesomeIcon className="icon-faArrowLeft" icon={faArrowLeft} /> </button>
                <h3>Nueva Solicitud de Cancelación</h3>
            </div>

            {/* Form fields and submission logic will go here */}
        </div>
    );
}

export default FormNewCancellation;