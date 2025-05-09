import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faUpload, faCheck } from '@fortawesome/free-solid-svg-icons';
import { getEnrollments } from '../../api/Students';
import {getDatesSemester} from '../util/Util';
import "./SubjectManagement.css"



function TableSubjects({ data, handleButtonLoadFile, handleButtonShowStudentsBySubjects, loading, setLoading, reloadVerifyStudents }) {

    const [verifiedStudents, setVerifiedStudents] = useState({});

    useEffect(() => {
        const fetchVerification = async () => {
            try {
                const {startDate, endDate} = getDatesSemester();
                const results = [];
                const loadDataVerify = await loadVerifyStudents();
                const validateData = loadDataVerify.filter(item => {
                    const date = new Date(item.subject.created_at);
                    return date >= startDate && date <= endDate;})
                const codesInData1 = validateData.map(item => item.subject.code);
                const filteredData2 = data.filter(item => codesInData1.includes(item.code));
                setVerifiedStudents(0);
                for (const row of filteredData2) {
                    results[row.id] = true;
                }
                setVerifiedStudents(curret => { return results });
                setTimeout(() => {
                    setLoading(curret => { return false })
                }, 2000);
            } catch (error) {
                console.error("Error al verificar los estudiantes:", error);
                setLoading(curret => { return false })
                setVerifiedStudents([]);
            }

        };

        if (data?.length > 0) {
            fetchVerification();
        }else {setLoading(curret => { return false })}

    }, [data, reloadVerifyStudents])

    const loadVerifyStudents = async () => {
        setLoading(true);
        const response = await getEnrollments().then((response) => {
            return response.data.data;
        }).catch((error) => {
            console.error("Error validate fetching subjects:", error);
            return [];
        });
        return response;
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
            grow: 1.4

        },
        {
            name: 'Creditos',
            selector: row => row.credits,
            sortable: true,
            grow: 0.1

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
                {verifiedStudents[row.id] ? (<>
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
