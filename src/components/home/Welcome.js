import React, { useState, useEffect } from 'react';
import './Welcome.css';
import { useNavigate, Outlet } from 'react-router-dom';
import { Nav, Spinner } from 'react-bootstrap';
//import "../../components/general.css";
//import { format } from 'date-fns';



const Welcome = () => {
    // Estado para manejar la carga
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("summary");
    const pathInitial = window.location.pathname;
    
    useEffect(() => {
        const path = window.location.pathname.split('/').pop();
        setActiveTab((path === 'home'? 'summary': path));
    }, [pathInitial]);


    const handleNavigation = async (path) => {
        navigate(`/admin/home${path}`);
    }
    
    const hadleButton = () => {
        navigate('/admin/cancellations/newCancellation');
    }

    return (
        <div className='row'>

            <div className='col-12 mb-2 row' style={{ padding: '0px', margin: '0px' }}>
                <div className='header-title'>
                    <h3 className="header ">Panel de control</h3>
                </div>
                <div className='col-12 col-md-7 content-sub-menu'>
                    <Nav className='custom-sub-menu' variant="tabs" activeKey={activeTab} onSelect={(selectedKey) => setActiveTab(selectedKey)}>
                        <Nav.Item>
                            <Nav.Link eventKey="summary" onClick={() => handleNavigation('/summary')}>Resumen</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="cancellations" onClick={() => handleNavigation('/cancellations')}>Cancelaciones</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="electives"onClick={() => handleNavigation('/electives')}>Electivas</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="reports" onClick={() => handleNavigation('/reports')}>Reportes</Nav.Link>
                        </Nav.Item>
                    </Nav>
                </div>
                <div className='col-12 col-md-5 content-button-add' >
                    <button onClick={() => hadleButton()}>+ Nueva cancelación</button>
                </div>
            </div>
            <div className='col-12 contet'>
                <Outlet />
            </div>
        </div>
    );
}

export default Welcome;