import { useState, useRef, useEffect, use, act } from "react";
import { getCancellations } from "../../../../api/Cancellations";
import { getElectives } from "../../../../api/Electives";
import { getStudents } from "../../../../api/Students";
import { getTimeAgo } from "./Util";
import { Spinner } from 'react-bootstrap';
import "./Summary.css";
import { faCaretSquareDown } from "@fortawesome/free-solid-svg-icons";


function Summary() {
    const [loading, setLoading] = useState(true);
    const dataCancellations = useRef(null)
    const dataElectives = useRef(null)
    const dataStudents = useRef(null)
    const actualDate = new Date();

    useEffect(() => {
        const fetch = async () => {
            await fetchAndStoreData(getCancellations, dataCancellations);
            await fetchAndStoreData(getElectives, dataElectives);
            await fetchAndStoreData(getStudents, dataStudents);
        }

        fetch();

        // (¿Debería ser getStudents aquí?)
    }, []);

    const fetchAndStoreData = async (fetchFunction, dataRef) => {
        try {
            setLoading(true);
            const response = await fetchFunction();
            // console.log(response.data, "response.data")
            dataRef.current = response.data;
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };



    const loadDataPending = () => {

        const oneDayAgo = new Date(actualDate.getTime() - (24 * 60 * 60 * 1000));
        if (dataCancellations.current) {
            const countRequest = dataCancellations.current.data.filter(request => request.status === 'pending');
            const recentRequests = countRequest.filter(request => {
                const createdAt = new Date(request.created_at);
                return createdAt >= oneDayAgo;
            });
            return { countRecentRequests: recentRequests.length, countRequest: countRequest.length }
        }
        return { countRecentRequests: 0, countRequest: 0 };
    }

    const loadDataApproved = () => {
        const firstDayOfWeek = new Date(actualDate);
        firstDayOfWeek.setDate(actualDate.getDate() - actualDate.getDay() + 0); // Domingo es 0, Lunes es 1
        firstDayOfWeek.setHours(0, 0, 0, 0);
        console.log(firstDayOfWeek, "fecha lunes")
        if (dataCancellations.current) {
            const countRequestApproved = dataCancellations.current.data.filter(request => request.status === 'approved');

            const weeklyRequests = countRequestApproved.filter(request => {
                const createdAt = new Date(request.created_at);
                return createdAt >= firstDayOfWeek;
            });

            return { countRequestApproved: countRequestApproved.length, countWeeklyRequests: weeklyRequests.length }
        }

        // console.log(dataCancellations.current.data.filter(request => request.status === 'approved').length, "ffff")
    }

    const loadDataElectives = () => {
        sortedRequests()
        //console.log(dataElectives.current.filter(request => request.status === 'pending').length , "ffff")
        return dataElectives.current ? dataElectives.current.data.length : 0;
    }

    const loadDataStudents = () => {
        //     console.log(dataStudents.current, "ffff2")
        if (dataStudents.current) {
            const countStudents = dataStudents.current.data;
            const { startOfSemester, endOfSemester } = calculatesemeter();
            const studentsThisSemester = countStudents.filter(student => {
                const createdAt = new Date(student.created_at);
                return createdAt >= startOfSemester && createdAt <= endOfSemester;
            });
            return { countStudents: studentsThisSemester.length, countStudentsThisSemester: studentsThisSemester.length }
        }

    }


    const calculatesemeter = () => {
        let startOfSemester;
        let endOfSemester;

        if (actualDate.getMonth() < 6) { // Enero (0) a Junio (5)
            startOfSemester = new Date(actualDate.getFullYear(), 0, 1); // 1 de Enero
            endOfSemester = new Date(actualDate.getFullYear(), 5, 30, 23, 59, 59, 999); // 30 de Junio
        } else {
            startOfSemester = new Date(actualDate.getFullYear(), 6, 1); // 1 de Julio
            endOfSemester = new Date(actualDate.getFullYear(), 11, 31, 23, 59, 59, 999); // 31 de Diciembre
        }
        return { startOfSemester, endOfSemester };
    }

    const sortedRequests = () => {
        try {
            if (dataCancellations.current) {

                const sortedRequests = [...dataCancellations.current.data].sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
    
                // 2. Tomar las primeras 5 solicitudes
                const latestFiveRequests = sortedRequests.slice(0, 5);
                return latestFiveRequests;
            }
            return [];
        }catch (error) {
            console.error("Error sorting requests:", error);
            return [];
        }
      
     

    }





    return (

        <div className='row content-summary'>
            <div className=" col-12 col-lg-8 content-wrapper" >
                <div className="row content-targets"  >
                    <div className="col-12 col-lg-6 target-group">
                        <div className="card-summary">
                            <h5>Cancelaciones pendientes</h5>
                            {loading ? (
                                <Spinner animation="border" size="sm" /> // Muestra el spinner mientras carga
                            ) : (
                                <>
                                    <h3>{loadDataPending().countRequest}</h3>
                                    <p>+{loadDataPending().countRecentRequests} desde ayer</p>
                                </>
                            )}
                        </div>


                        <div className="card-summary">
                            <h5>Electivas Registradas</h5>
                            {loading ? (
                                <Spinner animation="border" size="sm" /> // Muestra el spinner mientras carga
                            ) : (
                                <>
                                    <h3>{loadDataElectives()}</h3>
                                    <p>+{ } desde la ultima actualización</p>
                                </>
                            )}

                        </div>
                    </div>
                    <div className="col-12 col-lg-6 target-group">

                        <div className="card-summary">
                            <h5>Cancelaciones aprobadas</h5>
                            {loading ? (
                                <Spinner animation="border" size="sm" /> // Muestra el spinner mientras carga
                            ) : (
                                <>
                                    <h3>{loadDataApproved().countRequestApproved}</h3>
                                    <p>+{loadDataApproved().countWeeklyRequests} esta semana</p>
                                </>
                            )}
                        </div>


                        <div className="card-summary">
                            <h5>Etudiantes activos</h5>
                            {loading ? (
                                <Spinner animation="border" size="sm" /> // Muestra el spinner mientras carga
                            ) : (
                                <>
                                    <h3>{loadDataStudents().countStudents}</h3>
                                    <p>+{loadDataStudents().countStudentsThisSemester} este semestre</p>
                                </>
                            )}
                        </div>

                    </div>
                </div>

                <div className="content-recent-activity">
                    <h4>Actividad reciente</h4>
                    <p className="recent-activity-text">Últimas solicitudes y actualizaciones en el sistema</p>
                    {sortedRequests().map((request) => (
                        <div key={request.id} className="recent-activity-card">
                            <div>
                                <h3 className="recent-activity-title">Solicitud de cancelación #{request.id}</h3>
                                <p className="recent-activity-text">Estudiante: {request.student.name.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} - Asignatura: {request.subject.name}</p>
                            </div>
                            <p className="recent-activity-date">{getTimeAgo(request.updated_at)}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className=" col-12 col-lg-4 content-statistics">
                <h5>Estadisticas de cancelaciones</h5>
                <p>faBars</p>
                <p>faBars</p>
                <p>faBars</p>
                <p>faBars</p>
                <p>faBars</p>
                <p>faBars</p>
                <p>faBars</p>
                <p>faBars</p>
            </div>
        </div>

    );
}

export default Summary;