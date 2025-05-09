import React, { useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faEye } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, Outlet } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { getDatesSemester } from '../../util/Util';
import { getSubjects } from '../../../api/Subjects';
import "./ConsultElectives.css";
import { se } from 'date-fns/locale';

function ConsultElectives() {

    const [dataElectives, setDataElectives] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [paintNewComponent, setPaintNewComponent] = useState(false);
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

    const loadSubjects = () => {
        setLoading(current => { return true });
        const { startDate, endDate } = getDatesSemester();
        getSubjects().then((response) => {
            const data = response.data.data.filter(item => {
                const date = new Date(item.created_at);
                return date >= startDate && date <= endDate;
            });
            setDataElectives(data.filter(item => item.is_elective === true));
            setLoading( false );
        }).catch((error) => {
            setDataElectives([]);
            console.error("Error fetching subjects:", error);
        });
    }

   const columnsTable = [
        {
            name: 'Código',
            selector: row => row.code,
            sortable: true,
            grow:1
        },
        {
            name: 'Nombre',
            selector: row => row.name,
            sortable: true,
            grow:1
        },
        {
            name: 'Créditos',
            selector: row => row.credits,
            sortable: true,
            grow:1
        },
        {
            name: 'Semestre',
            selector: row => row.semester,
            sortable: true,
            grow:1
           
        },
        {
            name: 'Acciones',
            cell: row => <button className='btn-consult-students-by-electives' onClick={() => handleButtonShowStudentsBySubjects(row)}> <FontAwesomeIcon className="icon" icon={faEye}/>Ver Estudiantes</button>,
            ignoreRowClick: true,
            grow:1.5,
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

    if(paintNewComponent){
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
                        fixedHeaderScrollHeight={window.innerHeight<428?"calc(100vh - 115px)":"calc(100vh - 315px)"}
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
        </div>
    );
}

export default ConsultElectives;