import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faBookOpen, faChartColumn } from '@fortawesome/free-solid-svg-icons';
import "./Reports.css";

function Reports() {
    const cards = [
        { title: "Reporte de cancelación", icon: faPlus },
        { title: "Reporte de electivas", icon: faBookOpen },
        { title: "Reporte personalizado", icon: faChartColumn },
    ];


    return (
        <div className="reports">
            <h4>Reportes y Estadísticas</h4>
            <p>Genere informes detallados sobre la gestión académica</p>
            <p>Seleccione el tipo de reporte que desea generar.</p>
            <div className='cards-container'>
                {cards.map((card, index) => (
                    <div key={index} className="cards">
                        <FontAwesomeIcon icon={card.icon} size="2x" className="cards-icono" />
                        <h6>{card.title}</h6>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Reports;