import { useEffect, useState, useRef } from 'react';
import DataTable from 'react-data-table-component';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faUpload } from '@fortawesome/free-solid-svg-icons';
import { Spinner } from 'react-bootstrap';
import { useDropzone } from 'react-dropzone';
import { getStudentsBySubject } from '../../../api/Subjects';
import { apiLoadStudentsBySubject } from '../../../api/Students';
import FileDropzone from '../../../components/loadFile/FileDropzone';
import ConfirmationModal from '../../../components/ConfirmationModal/ConfirmationModal';
import CustomToast from '../../../components/toastMessage/CustomToast';
import "./ShowStudentsBySubject.css";


function ShowStudentsBySubject() {
    const location = useLocation();
    const subject = location.state?.subject;
    const navigate = useNavigate();
    const [students, setStudents] = useState([])
    const [loading, setLoading] = useState(false);
    const [fileXml, setFileXml] = useState(null);
    const [showFileDropzone, setShowFileDropzone] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showToast, setShowToast] = useState(false);     // Estado para mostrar/ocultar el Toast
    const [toastMessage, setToastMessage] = useState('');  // Estado para el mensaje del Toast
    const [toastType, setToastType] = useState('');
    const fileDropzoneRef = useRef(null);
    const reloadVerifyStudents = useRef(false);

    useEffect(() => {
        if (typeof subject !== "undefined") {
            loadStudents();
        } else {
            window.location.pathname.includes('subjectManagement') ? window.location.href = '/admin/subjectManagement' :
                window.location.href = '/admin/electives/electiveManagement/consultElectives';
        }
    }, [reloadVerifyStudents.current === true])


    useEffect(() => {
        function handleClickOutside(event) {
            if (
                fileDropzoneRef.current &&
                !fileDropzoneRef.current.contains(event.target) &&
                !document.querySelector('.modal.show')?.contains(event.target) // <- no cierra si el modal está abierto
            ) {
                setShowFileDropzone(false);
                setFileXml(null);
            }
        }

        if (showFileDropzone) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showFileDropzone]);


    const loadStudents = async () => {
        setLoading(true);
        let allStudents = [];
        let currentPage = 1;
        let totalPages = 1;
        try {
            while (currentPage <= totalPages) {
                const response = await getStudentsBySubject(subject.id, `page=${currentPage}`); // Asegúrate que esta función acepte el número de página como parámetro
                const json = response.data;
                allStudents.push(...json.data.data);
                console.log("json.data.data", json.data.data, "    ", "currentPage", currentPage)
                totalPages = json.data.total_pages;
                currentPage++;
            }
            setStudents(allStudents);
            setLoading(current => { return false })
        } catch (error) {
            console.error("Error fetching students:", error);
            setStudents([]);
        } finally {
            setLoading(false);
        }
    };

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

    const { getRootProps, getInputProps, isDragActive } = useDropzone({

        accept: {
            'text/xml': ['.xml']
        },
        onDropAccepted: (acceptedFiles) => {
            const file = acceptedFiles[0];
            if (file && (file.type === 'text/xml' || file.name.startsWith('.xml'))) {
                setFileXml(current => { return file });
            } else {
                setShowToast(current => { return true });
                setToastMessage('Por favor, selecciona solo archivos XML.');
                setToastType('danger');

            }
        },
        onDropRejected: () => {
            setToastMessage('Por favor, selecciona solo archivos XML.');
            setToastType('danger');
            setShowToast(true);
        },
        maxFiles: 1,
        multiple: false,
    });

    const handleButtonLoadFile = async (subject) => {
        //actualSubject.current = subject;
        setShowFileDropzone(current => { return true });
    }

    const handleCloseModal = () => {
        setShowModal(false);
    }

    const handleConfirmAction = () => {
        setLoading(current => { return true });
        setShowModal(false);
        setShowFileDropzone(false);
        const readerFile = new FileReader();
        readerFile.onload = (event) => {
            const xmlText = event.target.result;
            console.log("xmlText", xmlText)
            apiLoadStudentsBySubject(subject?.id, xmlText).then((response) => {
                reloadVerifyStudents.current = true;
                setShowToast(true);
                setToastMessage("Los estudiantes se han cargado correctamente.");
                setToastType('success');
                setFileXml(null);
                setLoading(current => { return false });
            }).catch((error) => {
                console.error("Error al cargar los estudiantes:", error);
                setShowToast(true);
                setToastMessage(error.response.data.message || 'Error al cargar los estudiantes.');
                setToastType('error');
                setLoading(current => { return false });
            });
        }
        readerFile.onerror = () => {
            console.error('Error al leer el archivo');
        };

        readerFile.readAsText(fileXml);
    }

    return (<>
        <div className='content-subject-student-by-subject'>
            <div className='content-title'>
                <button onClick={() => hadleButtonClickBack()}> <FontAwesomeIcon className="icon-faArrowLeft" icon={faArrowLeft} /> </button>
                <h3>Gestión de Materias: {subject?.code || 0}</h3>
            </div>

            <div className='card-students-by-subject'>
                <div className="card">Codigo <h3>{subject?.code || 0}</h3></div>

                <div className="card">Estudiantes inscritos<h3> {loading ?<Spinner animation="border" size="sm" />: students?.length || 0} </h3></div>

                <div className="card">Créditos <h3>{subject?.credits || 0}</h3></div>
            </div>
            <div className='row custom-student-by-subject-table'>
                <div className='col-12 col-lg-6'>
                    <h3 className='title-name-subject'>{subject?.name || ""}</h3>
                </div>
                <div className='col-12 col-lg-6 button-update-list'>
                    {window.location.pathname.includes('subjectManagement') && (
                        <button onClick={handleButtonLoadFile} disabled={loading}><FontAwesomeIcon className="icon" icon={faUpload} /> Actulizar Lista</button>
                    )}
                </div>
                <div className='contet-area-subject'>
                    <p>{subject?.area || 'Disciplinar y Profundización'}</p>
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
                {showFileDropzone && (
                    <div className='content-traparent-file-dropzone'>
                        <div className='content-file-dropzone' ref={fileDropzoneRef}>
                            <h4>Actulizar lista de estudiantes</h4>
                            <p>Cargue un archivo XML para actualizar la lista de estudiantes de la asignatura {subject?.name || ""}</p>
                            <FileDropzone
                                getRootProps={getRootProps}
                                getInputProps={getInputProps}
                                isDragActive={isDragActive}
                                file={fileXml}
                            />
                            <div className='content-buttons'>
                                <button className='btn-cancel' onClick={() => {
                                    setShowFileDropzone(false)
                                    setFileXml(null)
                                }}>cancelar</button>
                                <button className='btn-send' onClick={() => {
                                    if (fileXml !== null) {
                                        setShowModal(true)
                                    }
                                }}>Enivar lista</button>
                            </div>

                        </div>
                    </div>
                )}
                <ConfirmationModal
                    show={showModal}
                    onHide={handleCloseModal}
                    onConfirm={handleConfirmAction}
                    title={"Confirmar actualización"}
                    bodyText={`¿Estás seguro de que deseas actualizar la lista de estudiantes de la asignatura ${subject?.name || ""}?`}
                    confirmText={"Sí"}
                    cancelText="No"
                    containerId="modal-container"
                />
                <CustomToast
                    showToast={showToast}
                    setShowToast={setShowToast}
                    toastMessage={toastMessage}
                    toastType={toastType}
                />
            </div>
        </div>
    </>)
}

export default ShowStudentsBySubject;