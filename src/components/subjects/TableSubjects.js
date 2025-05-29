import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faUpload, faCheck } from '@fortawesome/free-solid-svg-icons';
import { getEnrollmentsBySubject } from '../../api/Students';
import "./SubjectManagement.css"



function TableSubjects({ data, handleButtonLoadFile, handleButtonShowStudentsBySubjects, loading, setLoading, reloadVerifyStudents, activeTabSubject }) {

    const [verifiedStudents, setVerifiedStudents] = useState({});

    useEffect(() => {
        const fetchVerification = async () => {
            try {
                const results = [];
                for (let i = 0; i < data.length; i++) {
                    const row = data[i];
                    const filteredData2 = await loadVerifyStudents(row.id);
                    if (filteredData2.length > 0) {
                        results[row.id] = filteredData2.length;
                    } else {
                        results[row.id] = 0;
                    }
                    if (i === data.length - 1) {
                        setTimeout(() => {
                            setLoading(false)
                        }, 1000);
                    }
                }
                setVerifiedStudents(curret => { return results });
            } catch (error) {
                console.error("Error al verificar los estudiantes:", error);
                setVerifiedStudents([]);
            }

        };

        if (data?.length > 0) {
            fetchVerification();
        } else { setLoading(curret => { return false }) }

    }, [data, reloadVerifyStudents, activeTabSubject])

    const loadVerifyStudents = async (id) => {
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

    const columnsTable = [
        {
            name: 'Codigo',
            selector: row => row.code,
            sortable: true,
            grow: 0.1
        },
        {
            name: 'Asignatura',
            selector: row => row.name,
            sortable: true,
            grow: 1.2

        },
        {
            name: 'Creditos',
            selector: row => row.credits,
            sortable: true,
            grow: 0.1

        },
        {
            name: 'Inscritos',
            selector: row => verifiedStudents[row.id] || 0,
            sortable: true,
            grow: 0.08
        },
        {
            name: 'Area',
            selector: row => <div className='content-table-area'>
                <p>{row.area}</p>
            </div>,
            grow: 1,



        },
        {
            name: 'Acciones',
            cell: (row) => <div className='content-button-subject'>
                <button className="button-view" onClick={() => handleButtonShowStudentsBySubjects(row)}><FontAwesomeIcon className="icon" icon={faEye} /> Ver</button>
                {verifiedStudents[row.id] > 0 ? (<>
                    <button className="button-load" disabled={true}><FontAwesomeIcon className="icon-check" icon={faCheck} /></button>
                </>
                ) : (
                    <button className="button-load" onClick={() => handleButtonLoadFile(row)}><FontAwesomeIcon className="icon" icon={faUpload} /> Cargar</button>
                )}
            </div>,
            grow: 1,
        },
    ];

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
    return (
        <>
            <DataTable
                columns={columnsTable}
                data={data}
                customStyles={customStyles}
                fixedHeader
                fixedHeaderScrollHeight={"calc(100vh - 210px)"}
                noDataComponent={<><br /> No hay datos para mostrar  <br /> <br /></>}
                progressPending={loading}
                progressComponent={(
                    <div className="loading-overlay-table">
                        <Spinner animation="border" size="lg" />
                    </div>
                )}
            />
        </>
    );
}

export default TableSubjects;
