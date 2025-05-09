import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import "./ConsultElectives.css";

function ConsultElectives() {
    const navigate = useNavigate();

    const hadleButtonClickBack = () => {
        navigate(-1);
    }

    const customStyles = {
        table: {
            style: {
                border: 'none', // Borde exterior de toda la tabla
                borderRadius: '5px',
                padding: '1px',
                marginBottom: '2px',
                borderCollapse: 'separate',
                borderBottom: 'solid 1px #000000',
                width: "auto",
            },
        },

        rows: {
            style: {
                // Cambia este color al que quieras
                borderTop: '1px solid #000000',
                borderBottom: 'none', // Cambia este color al que quieras
            },
        },
    };

    return (
        <div className='content-consult-electives'>
            <div className='content-title'>
                <button onClick={() => hadleButtonClickBack()}> <FontAwesomeIcon className="icon-faArrowLeft" icon={faArrowLeft} /> </button>
                <h3>Consulta de Electivas</h3>
            </div>

            <div className='custom-consult-electives'>
                <h3>Electivas Inscristas</h3>
                <div className='content-table-consult-electives'>
                    <DataTable
                        customStyles={customStyles}
                        noDataComponent={<><br /> No hay datos para mostrar  <br /> <br /></>}
                    />
                </div>
            </div>
        </div>
    );
}

export default ConsultElectives;