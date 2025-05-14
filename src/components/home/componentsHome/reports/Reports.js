import { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faBookOpen, faChartColumn } from '@fortawesome/free-solid-svg-icons';
import "./Reports.css";

function Reports() {
    const cards = [
        { title: "Reporte de cancelación", icon: faPlus },
        // { title: "Reporte de electivas", icon: faBookOpen },
        // { title: "Reporte personalizado", icon: faChartColumn },
    ];
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(false);
    const pathInitial = window.location.pathname;


    useEffect(() => {
        const validPaths = ['generateReport', 'pendingRequests'];

        if (!validPaths.some(path => pathInitial.includes(path))) {
            setActiveTab(false);
        }
        if (validPaths.some(path => window.location.pathname.includes(path))) {
            setActiveTab(true);
        }
    }, [pathInitial]);

    const handleCardClick = (index) => {
        switch (index) {
            case 0:
                setActiveTab(true);
                navigate('/admin/reports/reportsAndStatistics/generateReport');
                break;
            // case 1:
            //     setActiveTab(true);
            //     navigate('/admin/cancellations/cancellationManagement/pendingRequests');
            //     break;
            default:
                break;
        }

    }

    if (activeTab) {
        // setTimeout(() => {
        //     setActiveTab(false);
        // }, 2000)

        return (
            <>
                <Outlet />
            </>
        )
    }


    return (
        <div className="reports">
            <h4>Reportes y Estadísticas</h4>
            <p>Genere informes detallados sobre la gestión académica</p>
            <p>Seleccione el tipo de reporte que desea generar.</p>
            <div className='cards-container'>
                {cards.map((card, index) => (
                    <div key={index} className="cards" onClick={() => handleCardClick(index)}>
                        <FontAwesomeIcon icon={card.icon} size="2x" className="cards-icono" />
                        <h6>{card.title}</h6>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Reports;