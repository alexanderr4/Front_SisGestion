import { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useState } from 'react';
import "./Cancellations.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSheetPlastic, faChartColumn } from '@fortawesome/free-solid-svg-icons';


function Cancellations() {

    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(false);
    const pathInitial = window.location.pathname;
    const cards = [
        { title: "Nueva cancelación", icon: faPlus },
        { title: "Solicitudes pendientes", icon: faSheetPlastic },
        { title: "Historial de cancelaciones", icon: faChartColumn },
    ];

    useEffect(() => {
        const validPaths = ['newCancellation', 'pendingRequests', 'cancellationHistory'];

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
                navigate('/admin/cancellations/cancellationManagement/newCancellation');
                break;
            case 1:
                setActiveTab(true);
                navigate('/admin/cancellations/cancellationManagement/pendingRequests');
                break;
            case 2:
                setActiveTab(true);
                navigate('/admin/cancellations/cancellationManagement/cancellationHistory');
                break;
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

        <div className="cancellations row">
            <h4>Gestión de Cancelaciones</h4>
            <p>Administre las solicitudes de cancelacion de asignaturas</p>
            <p>Seleccione una acción para gestionar las cancelaciones de asignaturas </p>
            <div className='cards-container'>
                {cards.map((card, index) => (
                    <div key={index} className="cards" onClick={() => handleCardClick(index)}>
                        <FontAwesomeIcon icon={card.icon} size="2x" className="cards-icono" />
                        <h6>{card.title}</h6>
                    </div>
                ))}
            </div>
        </div>
    )

}


export default Cancellations;


