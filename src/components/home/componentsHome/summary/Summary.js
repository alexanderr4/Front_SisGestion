import { useState, useRef, useEffect, use, act } from "react";
import { getCancellations } from "../../../../api/Cancellations";
import { getElectives } from "../../../../api/Subjects";
import { getStudents } from "../../../../api/Students";
import { getTimeAgo } from "./Util";
import { Spinner } from 'react-bootstrap';
import Graph from "./Graph";
import GraphTwo from "./GraphTwo";
import CustomToast from '../../../toastMessage/CustomToast';
import "./Summary.css";


function Summary() {
    const [loading, setLoading] = useState(false);
    const dataCancellations = useRef([])
    const dataElectives = useRef([])
    const dataStudents = useRef([])
    const actualDate = new Date();
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('');

    useEffect(() => {
        const fetch = async () => {
            await fetchAndStoreData(getCancellations, dataCancellations, false);
            await fetchAndStoreData(getElectives, dataElectives, false);
            await fetchAndStoreData(getStudents, dataStudents);
        }

        fetch();
        sortedRequests()
    }, []);

    const fetchAndStoreData = async (fetchFunction, dataRef, usePagination = true) => {
        setLoading(true);
        let currentPage = 1;
        let totalPages = 1;
        const allData = [];
        try {
            if (usePagination) {
                while (currentPage <= totalPages) {
                    const response = await fetchFunction(`?page=${currentPage}`);
                    const data = response.data;

                    allData.push(...data.data.data);
                    totalPages = data.data.total_pages;
                    currentPage++;
                }
            } else {
                const response = await fetchFunction();
                const data = response.data.data;
                allData.push(...data);
            }
            dataRef.current = allData;
        } catch (error) {
            console.error("Error fetching data:", error);
            setTimeout(() => {
                setShowToast(true);
            }, 2000);
            setToastMessage(`${error.status || ''} Error al cargar los datos`);
            setToastType('error');
            dataRef.current = [];
        } finally {
            setLoading(false);
        }
    };



    const loadDataPending = () => {
        try {
            const oneDayAgo = new Date(actualDate.getTime() - (24 * 60 * 60 * 1000));
            if (dataCancellations.current) {
                const countRequest = dataCancellations.current.filter(request => request.status === 'pending');
                const recentRequests = countRequest.filter(request => {
                    const createdAt = new Date(request.created_at);
                    return createdAt >= oneDayAgo;
                });
                return { countRecentRequests: recentRequests.length, countRequest: countRequest.length }
            }
            return { countRecentRequests: 0, countRequest: 0 };
        } catch (error) {
            console.error("Error loading pending data:", error);
        }

    }

    const loadDataApproved = () => {
        try {
            const firstDayOfWeek = new Date(actualDate);
            firstDayOfWeek.setDate(actualDate.getDate() - actualDate.getDay() + 0); // Domingo es 0, Lunes es 1
            firstDayOfWeek.setHours(0, 0, 0, 0);
            if (dataCancellations.current) {
                const countRequestApproved = dataCancellations.current.filter(request => request.status === 'approved');
                const weeklyRequests = countRequestApproved.filter(request => {
                    const createdAt = new Date(request.created_at);
                    return createdAt >= firstDayOfWeek;
                });

                return { countRequestApproved: countRequestApproved.length, countWeeklyRequests: weeklyRequests.length }
            }
            return { countRequestApproved: 0, countWeeklyRequests: 0 }
        } catch (error) {
            console.error("Error loading approved data:", error);
        }
    }

    const loadDataElectives = () => {
        try {
            const electives = dataElectives.current ? dataElectives.current : []
            return electives.length;
        } catch (error) {
            console.error("Error loading elective data:", error);
            return 0;
        }

    }

    const loadDataStudents = () => {
        try {
            if (dataStudents.current) {
                const countStudents = dataStudents.current;
                const { startOfSemester, endOfSemester } = calculatesemeter();
                const studentsThisSemester = countStudents.filter(student => {
                    const createdAt = new Date(student.created_at);
                    return createdAt >= startOfSemester && createdAt <= endOfSemester;
                });
                return { countStudents: studentsThisSemester.length, countStudentsThisSemester: studentsThisSemester.length }
            }
            return { countStudents: 0, countStudentsThisSemester: 0 }
        } catch (error) {
            console.error("Error loading student data:", error);
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
            if (dataCancellations.current && dataCancellations.current) {

                const sortedRequests = [...dataCancellations.current].sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

                // 2. Tomar las primeras 5 solicitudes
                const latestFiveRequests = sortedRequests.slice(0, 5);
                return latestFiveRequests;
            }
            return [];
        } catch (error) {
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
                                    <h3>{loadDataPending()?.countRequest || 0}</h3>
                                    <p>+{loadDataPending()?.countRecentRequests || 0} desde ayer</p>
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
                                    <h3>{loadDataApproved()?.countRequestApproved || 0}</h3>
                                    <p>+{loadDataApproved()?.countWeeklyRequests || 0} esta semana</p>
                                </>
                            )}
                        </div>


                        <div className="card-summary">
                            <h5>Etudiantes activos</h5>
                            {loading ? (
                                <Spinner animation="border" size="sm" /> // Muestra el spinner mientras carga
                            ) : (
                                <>
                                    <h3>{loadDataStudents()?.countStudents || 0}</h3>
                                    <p>+{loadDataStudents()?.countStudentsThisSemester || 0} este semestre</p>
                                </>
                            )}
                        </div>

                    </div>
                </div>

                <div className="content-recent-activity">
                    <h4>Actividad reciente</h4>
                    <p className="recent-activity-text">Últimas solicitudes y actualizaciones en el sistema</p>
                    {loading ? (
                        <Spinner animation="border" size="sm" /> // Muestra el spinner mientras carga
                    ) : (
                        sortedRequests().length === 0 ? (
                            <div className="recent-activity-card">
                                <p className="recent-activity-title">No hay solicitudes recientes</p>
                            </div>
                        ) : (
                            sortedRequests().map((request) => (
                                <div key={request.id} className="recent-activity-card">
                                    <div>
                                        <h3 className="recent-activity-title">Solicitud de cancelación #{request.id}</h3>
                                        <p className="recent-activity-text">Estudiante: {request.student.name.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} - Asignatura: {request.subject.name}</p>
                                    </div>
                                    <p className="recent-activity-date">{getTimeAgo(request.updated_at)}</p>
                                </div>
                            ))
                        )
                    )
                    }

                </div>
            </div>
            <div className=" col-12 col-lg-4 content-statistics">
                <h5>Estadisticas de cancelaciones</h5>
                {loading ? (
                    <Spinner animation="border" size="sm" /> // Muestra el spinner mientras carga
                ) : (<>
                    <Graph data={dataCancellations.current} />
                    <br />
                    <br />
                    <GraphTwo data={dataCancellations.current}
                        electives={dataElectives.current}
                    />

                </>)
                }

            </div>
            <CustomToast
                showToast={showToast}
                setShowToast={setShowToast}
                toastMessage={toastMessage}
                toastType={toastType}
            />
        </div>

    );
}

export default Summary;