import React, { useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faEye } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, Outlet } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { getDatesSemester } from '../../util/Util';
import { getSubjects } from '../../../api/Subjects';
import { getEnrollmentsBySubject } from '../../../api/Students';
import CustomToast from '../../toastMessage/CustomToast';
import "./ConsultElectives.css";


function ConsultElectives() {

    const [dataElectives, setDataElectives] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [paintNewComponent, setPaintNewComponent] = useState(false);
    const [showToast, setShowToast] = useState(false);     // Estado para mostrar/ocultar el Toast
    const [toastMessage, setToastMessage] = useState('');  // Estado para el mensaje del Toast
    const [toastType, setToastType] = useState('');
    const [numberDataStudents, setNumberDataStudents] = useState(0);
    const pathInitial = window.location.pathname;


    useEffect(() => {
        if (pathInitial === "/admin/electives/electiveManagement/consultElectives") {
            setPaintNewComponent(current => { return false });
        }
        if (window.location.pathname === "/admin/electives/electiveManagement/consultElectives/showStudentsBySubject") {
            setPaintNewComponent(current => { return true });
        }
    }, [pathInitial]);

    useEffect(() => {
        const fetchLoadData = async () => {
            loadSubjects();
        }
        fetchLoadData();
    }, [])


    useEffect(() => {
        const fetchLoadDataStudents = async () => {
            if (dataElectives.length > 0) {
                const results = [];
                for (let i = 0; i < dataElectives.length; i++) {
                    const row = dataElectives[i];
                    const filteredData2 = await loadtNumberStudentsBySubject(row.id);
                    if (filteredData2.length > 0) {
                        results[row.id] = filteredData2.length;
                    } else {
                        results[row.id] = 0;
                    }
                    if (i === dataElectives.length - 1) {
                        setTimeout(() => {
                            setLoading(false);
                        }, 1000);
                    }
                }
                setNumberDataStudents(current => { return results });
            }
        }
        fetchLoadDataStudents();
    }, [dataElectives]);

    console.log("estudiantes", numberDataStudents);

    const loadSubjects = async () => {
        setLoading(true);
        const { startDate, endDate } = getDatesSemester();
        const allSubjects = [];
        let currentPage = 1;
        let totalPages = 1;
        try {
            while (currentPage <= totalPages) {
                const response = await getSubjects(`?page=${currentPage}`);
                const json = response.data;
                allSubjects.push(...json.data.data);
                totalPages = json.data.total_pages + 1;
                currentPage++;
            }
            const filtered = allSubjects.filter(item => {
                const date = new Date(item.created_at);
                return date >= startDate && date <= endDate;
            });
            setDataElectives(filtered.filter(item => item.is_elective === true));
        } catch (error) {
            setLoading(false);
            setDataElectives([]);
            if (typeof error.status !== 'undefined')
                setShowToast(true);
            setToastMessage(`${error.status} Error al cargar los datos`);
            setToastType('error');
            console.error("Error fetching subjects:", error);
        } finally {
            setLoading(false);
        }
    };


    const loadtNumberStudentsBySubject = async (id) => {
        if (dataElectives.length > 0) {
            setLoading(true);
            try {
                if (id) {
                    const response = await getEnrollmentsBySubject(id, '?page=1&page_size=90');
                    return response.data.data.data;
                }
            } catch (error) {
                console.error("Error al obtener los enrollments:", error);
                setLoading(false)
                return [];
            } finally {
                //setLoading(false);
            }
        }
    }


    const columnsTable = [
        {
            name: 'Código',
            selector: row => row.code,
            sortable: true,
            grow: 1
        },
        {
            name: 'Nombre',
            selector: row => row.name,
            sortable: true,
            grow: 1
        },
        {
            name: 'Créditos',
            selector: row => row.credits,
            sortable: true,
            grow: 1
        },
        {
            name: 'Semestre',
            selector: row => row.semester,
            sortable: true,
            grow: 1

        },
        {
            name: 'Inscritos',
            selector: row => numberDataStudents[row.id] || 0,
            sortable: true,
            grow: 1
        },
        {
            name: 'Acciones',
            cell: row => <button className='btn-consult-students-by-electives' onClick={() => handleButtonShowStudentsBySubjects(row)}> <FontAwesomeIcon className="icon" icon={faEye} />Ver Estudiantes</button>,
            ignoreRowClick: true,
            grow: 1.5,
        }
    ]



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


    const hadleButtonClickBack = () => {
        navigate(-1);
    }

    const handleButtonShowStudentsBySubjects = (row) => {
        navigate('/admin/electives/electiveManagement/consultElectives/showStudentsBySubject', { state: { subject: row } });
        setPaintNewComponent(true);
    }

    if (paintNewComponent) {
        return <Outlet />;
    }

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
                        columns={columnsTable}
                        data={dataElectives}
                        customStyles={customStyles}
                        fixedHeader
                        fixedHeaderScrollHeight={window.innerHeight < 428 ? "calc(100vh - 115px)" : "calc(100vh - 315px)"}
                        noDataComponent={<><br /> No hay datos para mostrar  <br /> <br /></>}
                        progressPending={loading}
                        progressComponent={(
                            <div className="loading-overlay-table">
                                <Spinner animation="border" size="lg" />
                            </div>
                        )}
                    />
                </div>
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

export default ConsultElectives;