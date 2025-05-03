import React, { useState, useEffect } from 'react';
import './ControlPanel.css';
import { useNavigate, Outlet } from 'react-router-dom';
import { Nav, Spinner } from 'react-bootstrap';
//import "../../components/general.css";
//import { format } from 'date-fns';



const ControlPanel = () => {
    // Estado para manejar la carga
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("summary");
    const pathInitial = window.location.pathname;

    useEffect(() => {
        const path = window.location.pathname.split('/').pop();
        setActiveTab((path === 'home' ? 'summary' : path));


    }, [pathInitial]);

    useEffect(() => {
        const pathSegments = window.location.pathname.split('/').filter(Boolean);
        const redirects = {
            home: '/admin/home/summary',
            cancellations: '/admin/cancellations/cancellationManagement',
            electives: '/admin/electives/electiveManagement',
            reports: '/admin/reports/reportsAndStatistics',
        };

        const target = redirects[pathSegments[1]];
        if (target && pathSegments.length === 2) {
            navigate(target);
        }
    }, []);


    const handleNavigation = async (path) => {
        navigate(`/admin${path}`);
    }

    const hadleButton = () => {
        navigate('/admin/cancellations/cancellationManagement/newCancellation');
    }

    if (window.location.pathname.split('/').length > 4) {
        return (
            <Outlet />
        )

    }

    return (
        <div className='row main-container'>

            <div className='col-12 mb-2 row' style={{ padding: '0px', margin: '0px' }}>
                <div className='header-title'>
                    <h3 className="header ">Panel de control</h3>
                </div>
                <div className='col-12 col-md-6 content-sub-menu'>
                    <Nav className='custom-sub-menu' variant="tabs" activeKey={activeTab} onSelect={(selectedKey) => setActiveTab(selectedKey)}>
                        <Nav.Item>
                            <Nav.Link eventKey="summary" onClick={() => handleNavigation('/home/summary')}>Resumen</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="cancellationManagement" onClick={() => handleNavigation('/cancellations/cancellationManagement')}>Cancelaciones</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="electiveManagement" onClick={() => handleNavigation('/electives/electiveManagement')}>Electivas</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="reportsAndStatistics" onClick={() => handleNavigation('/reports/reportsAndStatistics')}>Reportes</Nav.Link>
                        </Nav.Item>
                    </Nav>
                </div>
                <div className='col-12 col-md-6 content-button-add' >
                    <button onClick={() => hadleButton()}>+ Nueva cancelación</button>
                </div>
            </div>
            <div className='col-12 contet'>
                <Outlet />
            </div>
        </div>
    );
}

export default ControlPanel;