import { useEffect, useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Outlet, useNavigate } from 'react-router-dom';
import { Nav } from 'react-bootstrap';
import TableSubjects from './TableSubjects';
import { getSubjects } from '../../api/Subjects';
import { apiLoadStudentsBySubject } from '../../api/Students';
import VerifySubjects from "./VerifySubjects"
import { useDropzone } from 'react-dropzone';
import { getDatesSemester } from '../util/Util';
import CustomToast from '../toastMessage/CustomToast';
import FileDropzone from '../loadFile/FileDropzone';
import ConfirmationModal from "../ConfirmationModal/ConfirmationModal";
import "./SubjectManagement.css";


function SubjectManagement() {

    const navigate = useNavigate();
    const [activeTabSubject, setActiveTabSubject] = useState('1');
    const [subjectData, setSubjectData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showWindow, setShowWindow] = useState(false);
    const pathInitial = window.location.pathname;
    const [showToast, setShowToast] = useState(false);     // Estado para mostrar/ocultar el Toast
    const [toastMessage, setToastMessage] = useState('');  // Estado para el mensaje del Toast
    const [toastType, setToastType] = useState('');
    const [fileXml, setFileXml] = useState(null);
    const [showFileDropzone, setShowFileDropzone] = useState(false);
    const fileDropzoneRef = useRef(null);
    const [showModal, setShowModal] = useState(false);
    const actualSubject = useRef(null);
    const reloadVerifyStudents = useRef(false);

    const hadleButtonClickBack = () => {
        navigate(-1)
    }

    useEffect(() => {
        if (pathInitial === "/admin/subjectManagement") {
            setShowWindow(current => { return false });
        }
        if (window.location.pathname === "/admin/subjectManagement/showStudentsBySubject") {
            setShowWindow(current => { return true });
        }
    }, [pathInitial]);

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

    useEffect(() => {
        const fetchLoadData = async () => {
            loadSubjects();
        }
        fetchLoadData();
    }, [activeTabSubject, reloadVerifyStudents.current]);

    const loadSubjects = async () => {
        setLoading(true);
        const allSubjects = [];
        let currentPage = 1;
        let totalPages = 1;
        const { startDate, endDate } = getDatesSemester(activeTabSubject);
        try {
            while (currentPage <= totalPages) {
                const res = await getSubjects(`?page=${currentPage}`);
                const json = await res.data;
                allSubjects.push(...json.data.data);
                totalPages = json.data.total_pages;
                currentPage++;
            }
            const filteredSubjectsBySemesters = VerifySubjects(allSubjects.filter((subject) => subject.semester === Number(activeTabSubject)));
            setSubjectData(filteredSubjectsBySemesters.filter((subject) => new Date(subject.created_at) >= startDate && new Date(subject.created_at) <= endDate));
        } catch (error) {
           setSubjectData([]);
            setLoading(false);
            console.error("Error fetching subjects:", error);
            typeof error.status !== 'undefined'? setShowToast(true): setShowToast(false);
            setToastMessage(`${error.status} Error al cargar los datos`);
            setToastType('error');
        }

        // setLoading(true);
        // const { startDate, endDate } = getDatesSemester(activeTabSubject);
        // await getSubjects().then((response) => {
        //     console.log("response", response);
        //     const filteredSubjectsBySemesters = VerifySubjects(response.data.data.data.filter((subject) => subject.semester === Number(activeTabSubject)));
        //     setSubjectData(filteredSubjectsBySemesters.filter((subject) => new Date(subject.created_at) >= startDate && new Date(subject.created_at) <= endDate));
        // }).catch((error) => {
        //     setSubjectData([]);
        //     setLoading(false);
        //     console.error("Error fetching subjects:", error);
        //     typeof error.status !== 'undefined'? setShowToast(true): setShowToast(false);
        //     setToastMessage(`${error.status} Error al cargar los datos`);
        //     setToastType('error');
        // });
    }

    const handleButtonShowStudentsBySubjects = async (subject) => {
        setShowWindow(current => { return true });
        navigate("/admin/subjectManagement/showStudentsBySubject", { state: { subject } });
    }

    // carga del archivo xml
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
        actualSubject.current = subject;
        setShowFileDropzone(current => { return true });
    }

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleConfirmAction = async () => {
        setShowModal(false);
        setShowFileDropzone(false);
        const reader = new FileReader();
        reader.onload = (event) => {
            const xmlText = event.target.result;
            apiLoadStudentsBySubject(actualSubject?.current.id, xmlText).then((response) => {
                reloadVerifyStudents.current = true;
                setShowToast(true);
                setToastMessage("Los estudiantes se han cargado correctamente.");
                setToastType('success');
                setFileXml(null);
            }).catch((error) => {
                console.error("Error al cargar los estudiantes:", error);
                setShowToast(true);
                setToastMessage(error.response.data.message || 'Error al cargar los estudiantes.');
                setToastType('error');
            });
            // Aquí puedes trabajar con el texto: enviarlo al backend, parsearlo, etc.
        };

        reader.onerror = () => {
            console.error('Error al leer el archivo');
        };

        reader.readAsText(fileXml);


    };

    if (showWindow) {
        return <>
            <Outlet />
        </>
    }

    return (
        <div className='content-subject-management'>
            <div className='content-title'>
                <button onClick={() => hadleButtonClickBack()}> <FontAwesomeIcon className="icon-faArrowLeft" icon={faArrowLeft} /> </button>
                <h3>Gestión de Materias</h3>
            </div>

            <div className='content-subject-management-sub-menu'>
                <h3>Materias por Semestre</h3>
                <p>Visualice y gestione las materias organizadas por semestre académico y cargue la lista de estudiantes inscritos para el semestre actual</p>
                <div className='content-sub-menu-subject-management'>
                    <Nav className='custom-sub-menu-subject' variant="tabs" activeKey={activeTabSubject} onSelect={(selectedKey) => setActiveTabSubject(selectedKey)}>
                        <Nav.Item>
                            <Nav.Link eventKey="1" >Sem 1</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="2">Sem 2</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="3">Sem 3</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="4">Sem 4</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="5">Sem 5</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="6">Sem 6</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="7">Sem 7</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="8">Sem 8</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="9">Sem 9</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="10">Sem 10</Nav.Link>
                        </Nav.Item>
                    </Nav>
                </div>

            </div>
            <div className='content-table-subject-management'>
                <TableSubjects
                    data={subjectData}
                    loading={loading}
                    setLoading={setLoading}
                    handleButtonShowStudentsBySubjects={handleButtonShowStudentsBySubjects}
                    handleButtonLoadFile={handleButtonLoadFile}
                    reloadVerifyStudents={reloadVerifyStudents.current}
                    activeTabSubject={activeTabSubject}
                />
            </div>
            <CustomToast
                showToast={showToast}
                setShowToast={setShowToast}
                toastMessage={toastMessage}
                toastType={toastType}
            />
            {showFileDropzone && (
                <div className='content-traparent-file-dropzone'>
                    <div className='content-file-dropzone' ref={fileDropzoneRef}>
                        <h4>Lista de estudiantes</h4>
                        <p>Cargue un archivo XML</p>
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
                title={"Confirmar registro"}
                bodyText={"¿Estás seguro de que deseas cargar los estudiantes?"}
                confirmText={"Sí"}
                cancelText="No"
                containerId="modal-container"
            />

        </div>
    )
}

export default SubjectManagement;