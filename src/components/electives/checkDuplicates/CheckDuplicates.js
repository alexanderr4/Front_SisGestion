import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

function CheckDuplicates({ electives }) {
  const navigate = useNavigate();


  const hadleButtonClickBack = () => {
    navigate(-1);
  }

  return (
    <div className='content-check-duplicates'>
      <div className='content-title'>
        <button onClick={() => hadleButtonClickBack()}> <FontAwesomeIcon className="icon-faArrowLeft" icon={faArrowLeft} /> </button>
        <h3>Verificación de Duplicados</h3>
      </div>
    </div>
  );
}

export default CheckDuplicates;