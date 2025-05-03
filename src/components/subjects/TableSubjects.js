import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faUpload, faCheck } from '@fortawesome/free-solid-svg-icons';
import { getStudentsBySubject } from '../../api/Subjects';
import "./SubjectManagement.css"

function TableSubjects({ data, handleButtonLoadFile, handleButtonShowStudentsBySubjects, loading, setLoading, reloadVerifyStudents }) {

    const [verifiedStudents, setVerifiedStudents] = useState({});

    useEffect(() => {
        const fetchVerification = async () => {
            setLoading(true);
            const results = {};
            for (const row of data) {
                const isVerified = await verifyStudents(row.id);
                results[row.id] = isVerified;
            }
            setVerifiedStudents(results);
        };

        if (data?.length > 0) {
            fetchVerification();
        }
        setTimeout(() => {
            setLoading(curret => { return false })
        }, 3500)

    }, [data, reloadVerifyStudents])

    const verifyStudents = async (subjectId) => {
        try {
            const students = (await getStudentsBySubject(subjectId)).data.data;
            return students.length > 0 ? true : false;
        } catch (error) {
            console.error("Error fetching students:", error);
            return false
        }

    }

    const columnsTable = [
        {
            name: 'Codigo',
            selector: row => row.code,
            sortable: true,
            grow: 2,
            width: '18%',
        },
        {
            name: 'Asignatura',
            selector: row => row.name,
            sortable: true,
            grow: 1,
        },
        {
            name: 'Creditos',
            selector: row => row.credits,
            sortable: true,
            width: '14%',
        },
        {
            name: 'Area',
            selector: row => <div className='content-table-area'>
                <p>{row.area}</p>
            </div>,
            width: '26%'

        },
        {
            name: 'Acciones',
            cell: (row) => <div className='content-button-subject'>
                <button className="button-view" onClick={() => handleButtonShowStudentsBySubjects(row)}><FontAwesomeIcon className="icon" icon={faEye} /> Ver</button>
                {verifiedStudents[row.id] ? (<>

                    <button className="button-load" disabled={true}><FontAwesomeIcon className="icon-check" icon={faCheck} /></button>
                </>
                ) : (
                    <button className="button-load" onClick={() => handleButtonLoadFile(row)}><FontAwesomeIcon className="icon" icon={faUpload} /> Cargar</button>

                )}
            </div>,
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            width: '26%',
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
