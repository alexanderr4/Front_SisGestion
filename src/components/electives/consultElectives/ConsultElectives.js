import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

function ConsultElectives() {
    const navigate = useNavigate();

    const hadleButtonClickBack = () => {
        navigate(-1);
    }

    return (
        <div className='content-check-duplicates'>
            <div className='content-title'>
                <button onClick={() => hadleButtonClickBack()}> <FontAwesomeIcon className="icon-faArrowLeft" icon={faArrowLeft} /> </button>
                <h3>Consulta de Electivas</h3>
            </div>
        </div>
    );
}

export default ConsultElectives;