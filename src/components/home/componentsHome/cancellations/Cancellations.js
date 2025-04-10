import "./Cancellations.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSheetPlastic, faChartColumn } from '@fortawesome/free-solid-svg-icons';


function Cancellations() {

    const cards = [
        { title: "Nueva cancelación", icon: faPlus },
        { title: "Solicitudes pendientes", icon: faSheetPlastic },
        { title: "Historial de cancelaciones", icon: faChartColumn },
    ];

    return (
        <div className="cancellations row">
            <h4>Gestión de Cancelaciones</h4>
            <p>Administre las solicitudes de cancelacion de asignaturas</p>
            <p>Seleccione una acción para gestionar las cancelaciones de asignaturas </p>
            <div className='cards-container'>
                {cards.map((card, index) => (
                    <div key={index} className="cards">
                        <FontAwesomeIcon icon={card.icon} size="2x" className="cards-icono" />
                        <h6>{card.title}</h6>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Cancellations;


