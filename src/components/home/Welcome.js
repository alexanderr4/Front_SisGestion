import React, { useState, useEffect } from 'react';
import './Welcome.css';
import { Nav, Spinner } from 'react-bootstrap';
//import "../../components/general.css";
//import { format } from 'date-fns';



const Welcome = () => {


    const [UserActive, setVariable] = useState(0);
    const [clients, setClients] = useState(0);
    const [equipments, setEquipments] = useState(0);
    const [requests, setRequests] = useState([]);
    const [requestsPending, setRequestsPending] = useState(0);
    const [loading, setLoading] = useState(true); // Estado para manejar la carga


    useEffect(() => {
        fetchData();

    }, []);

    const fetchData = async () => {
        try {

            const responseClients = {}//await getClientsActive(localStorage.getItem('authToken'));
            setClients(responseClients.length);

            const responseEquipments = {}//await getEquipments(localStorage.getItem('authToken'));
            setEquipments(responseEquipments.length);

            const responseRequestsPending = {}//await getRequestMaintenace(localStorage.getItem('authToken'));
            //setRequests(responseRequestsPending.data);
            // setRequestsPending(((responseRequestsPending.data).map(request => request.requestMaintenanceStatus === "Pendiente")).length);


            const response = {} //await getUsersWithoutAdminRole(localStorage.getItem('authToken'));
            setVariable(response.data.length);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false); // Finaliza la carga
        }
    };
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return ""//format(date, 'dd/MM/yyyy hh:mm a');
    };
    const [activeTab, setActiveTab] = useState("resumen");
    return (
        <div className='row'>

            <div className='col-12 mb-2 row'>
                <div className='header-title'>
                    <h3 className="header ">Panel de control</h3>
                </div>
                <div className='col-12 col-md-7 content-sub-menu'>
                    <Nav className ='custom-sub-menu' variant="tabs" activeKey={activeTab} onSelect={(selectedKey) => setActiveTab(selectedKey)}>
                        <Nav.Item>
                            <Nav.Link eventKey="resumen">Resumen</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="cancelaciones">Cancelaciones</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="electivas">Electivas</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="reportes">Reportes</Nav.Link>
                        </Nav.Item>
                    </Nav>
                </div>
                <div className='col-12 col-md-5' >
                    <button>Nueva cancelacion</button>
                </div>
            </div>


            <div className='col-12'>
                <div className="content-wrapper" >
                    <div className="row  mb-4"  >
                        <div className="col-lg-1"> </div>
                        <div className=" col-md-6 col-lg-2 ">
                            <div className="card-summary">
                                <h5>Solicitudes Totales</h5>
                                {loading ? (
                                    <Spinner animation="border" size="sm" /> // Muestra el spinner mientras carga
                                ) : (
                                    <p>{requests.length}</p> // Muestra los datos una vez cargados
                                )}
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-2">
                            <div className="card-summary">
                                <h5>Solicitudes Pendientes</h5>
                                {loading ? (
                                    <Spinner animation="border" size="sm" /> // Muestra el spinner mientras carga
                                ) : (
                                    <p>{requestsPending}</p> // Muestra los datos una vez cargados
                                )}
                            </div>
                        </div>
                        <div className="col-md-12 col-lg-2">
                            <div className="card-summary">
                                <h5>Equipos Registrados</h5>
                                {loading ? (
                                    <Spinner animation="border" size="sm" /> // Muestra el spinner mientras carga
                                ) : (
                                    <p>{equipments}</p> // Muestra los datos una vez cargados
                                )}
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-2">
                            <div className="card-summary">
                                <h5>Técnicos Activos</h5>
                                {loading ? (
                                    <Spinner animation="border" size="sm" /> // Muestra el spinner mientras carga
                                ) : (
                                    <p>{UserActive}</p> // Muestra los datos una vez cargados
                                )}
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-2 ">
                            <div className="card-summary">
                                <h5>Clientes Activos</h5>
                                {loading ? (
                                    <Spinner animation="border" size="sm" /> // Muestra el spinner mientras carga
                                ) : (
                                    <p>{clients}</p> // Muestra los datos una vez cargados
                                )}
                            </div>
                        </div>
                    </div>

                    <h2 className="text-muted">Solicitudes de Mantenimiento Recientes</h2>
                    <div className="requests-list">
                        {loading ? (
                            <div className="spinner-container">
                                <Spinner animation="border" size="lg" /> {/* Muestra el spinner mientras carga */}
                            </div> // Muestra el spinner mientras carga
                        ) : (
                            requests.sort((a, b) => new Date(b.requestDate) - new Date(a.requestDate))
                                .slice(0, 7).map((record) => (

                                    <div key={record.id} className="request-item">

                                        <span>{record.requestNumber}</span>

                                        {/* <span>{format(new Date(record.requestDate), 'dd/MM/yyyy hh:mm a')}</span> */}

                                        <span className={`status ${record.requestMaintenanceStatus.toLowerCase() === 'pendiente' ? 'pending' : 'completed'}`}>{record.requestMaintenanceStatus}</span>

                                    </div>
                                ))
                        )}
                    </div>
                </div>
            </div>

        </div>







    );
}

export default Welcome;