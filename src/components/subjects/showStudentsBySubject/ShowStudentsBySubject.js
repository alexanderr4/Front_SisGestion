import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faUpload } from '@fortawesome/free-solid-svg-icons';
import { Spinner } from 'react-bootstrap';
import { getStudentsBySubject } from '../../../api/Subjects';
import DataTable from 'react-data-table-component';
import "./ShowStudentsBySubject.css";
import { width } from '@fortawesome/free-solid-svg-icons/fa0';
import { set } from 'date-fns';

function ShowStudentsBySubject() {
    const location = useLocation();
    const subject = location.state?.subject;
    const navigate = useNavigate();
    const [students, setStudents] = useState([])
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        if (typeof subject !== "undefined") {
            loadStudents()
            setTimeout(() => {
                setLoading(current => { return false });
            }, 1000)
          
        }else{
            window.location.href = '/admin/subjectManagement';
        }
    }, [])


    const loadStudents = async () => {
        setLoading(current => { return true });
        try {
            const response = await getStudentsBySubject(subject.id);

            setStudents(response.data.data);
            //console.log("students", students.current.length);
        } catch (error) {
            console.error("Error fetching students:", error);
            setStudents([]);
        }
    }

    const hadleButtonClickBack = () => {
        navigate(-1)
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const formattedDate = date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
        return formattedDate;
    }

    const columnsTable = [
        {
            name: 'Codigo del estudiante',
            selector: row => row.student.code,
            sortable: true,
            grow: 2,
            width: '33%',
        },
        {
            name: 'Estudiante',
            selector: row => row.student.name,
            sortable: true,
            grow: 1,
            width: "33%"
        },
        {
            name: 'Fecha',
            selector: row => formatDate(row.student.updated_at),
            sortable: true,
            grow: 1,
            width: "33%"
        },
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

    return (<>
        <div className='content-subject-student-by-subject'>
            <div className='content-title'>
                <button onClick={() => hadleButtonClickBack()}> <FontAwesomeIcon className="icon-faArrowLeft" icon={faArrowLeft} /> </button>
                <h3>Gestión de Materias: {subject?.code || 0}</h3>
            </div>

            <div className='card-students-by-subject'>
                <div className="card">Codigo <h3>{subject?.code || 0}</h3></div>
                <div className="card">Estudiantes inscritos <h3>{students?.length ||0}</h3></div>
                <div className="card">Créditos <h3>{subject?.credits ||0}</h3></div>
            </div>
            <div className='row custom-student-by-subject-table'>
                <div className='col-12 col-lg-6'>
                    <h3>{subject?.name ||""}</h3>
                </div>
                <div className='col-12 col-lg-6 button-update-list'>
                    <button><FontAwesomeIcon className="icon" icon={faUpload} /> Actulizar Lista</button>
                </div>
                <div className='contet-area-subject'>
                    <p>{subject?.area ||0}</p>
                </div>

                <div className='content-table-student-by-subject'>
                    <DataTable
                        columns={columnsTable}
                        data={students}
                        customStyles={customStyles}
                        fixedHeader
                        fixedHeaderScrollHeight={"calc(100vh - 210px)"}
                        progressPending={loading}
                        progressComponent={(
                            <div className="loading-overlay-table">
                                <Spinner animation="border" size="lg" />
                            </div>
                        )}
                    />
                </div>
            </div>


        </div>
    </>)
}

export default ShowStudentsBySubject;