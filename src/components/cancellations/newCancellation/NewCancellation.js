import { useState, useRef, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import FormNewCancellation from "./FormNewCancellation";
import { getStudents } from "../../../api/Students";
import { getSubjects } from "../../../api/Subjects";
import { createCancellation } from "../../../api/Cancellations";
import { getEnrollments } from "../../../api/Students";
import CustomToast from '../../toastMessage/CustomToast';


function NewCancellation() {

    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('');
    const [optionStundent, setOptionStudent] = useState(true);
    const [optionAsignature, setOptionAsignature] = useState(true);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('');


    const dataElectives = useRef(null)
    const dataStudents = useRef(null)

    const navigate = useNavigate();
    const formData = {
        student: {},
        subject: {},
        justification: "",
        comments: ""
    }

    const [loadData, setLoadData] = useState(formData);


    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            await fetchAndStoreData(getEnrollments, dataElectives);
            await fetchAndStoreData(getStudents, dataStudents);
        }

        fetch();

    }, []);

    // useEffect(() => {
    //     const fetch = async () => {
    //         await fetchAndStoreData(getSubjects, getEnrollments);
    //     }

    //     fetch();
    // }, [loadData]);

    const fetchAndStoreData = async (fetchFunction, dataRef) => {
        setLoading(true);
        let currentPage = 1;
        let totalPages = 9;
        let allData = [];
        try {
            while (currentPage <= totalPages) {
                const response = await fetchFunction(`?page=${currentPage}&page_size=100`); // debe aceptar el número de página
                const json = response.data;
                allData.push(...json.data.data);
                currentPage++;
            }
            dataRef.current = allData;
            setLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
            setShowToast(true);
            setToastMessage(`${error.status || ''} Error al cargar los datos`);
            setToastType('error');
            setLoading(false);
            dataRef.current = [];
        } finally {
            //setTimeout(() => {setLoading(false)} , 1000);

        }
    };

    const mapNameStudent = () => {
        return dataStudents.current ? dataStudents.current : []
    }



    const mapNameSubjects = () => {
        try {
            return dataElectives.current.filter(entry =>
                entry.student.id === loadData.student.id
            ).map(entry => entry.subject);
        } catch (error) {
            return []
        }


        //return dataElectives.current && dataElectives.current.data ? dataElectives.current.data : []
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLoadData({
            ...loadData,
            [name]: value,
        });
    };


    const hadleButtonClickBack = () => {
        navigate(-1)
    }


    const handleSubmit = (e) => {
        e.preventDefault();
        setModalType('register');
        setShowModal(true);

    };

    const handleCancel = () => {
        setModalType('cancel');  // Definimos el tipo de acción como cancelar
        setShowModal(true);      // Mostramos el modal
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleConfirmAction = async () => {
        setShowModal(false);
        if (modalType === 'cancel') {
            setLoading(false);
            setLoadData(formData);
            navigate(-1)
        } else if (modalType === 'register') {
            const sendData = {
                student_id: loadData.student.id,
                subject_id: loadData.subject.id,
                group: "01",
                justification: loadData.justification,
                comments: loadData.comments
            }
            createCancellation(sendData).then((response) => {
                setShowToast(true)
                setToastMessage("Solicitud de cancelación creada con éxito")
                setToastType('success')
                setTimeout(() => {
                    setLoading(false);
                    window.location.href = '/admin/cancellations/cancellationManagement/newCancellation'
                }, 1000)

            }).catch((error) => {
                console.error(error);
                setLoading(false);
                setShowToast(true)
                setToastMessage(error.request.status === 500 ? "No se puede cancelar esta materia, ya que al hacerlo el estudiante quedaría con menos del 50% de créditos activos requeridos para mantener la carga académica mínima.No se puede cancelar esta materia. Créditos totales: 3, Ya cancelados: 0, Materia a cancelar: 3 créditos. Quedarían solo 0 créditos activos, menos del 50% requerido (1 créditos mínimos)" :
                    "Error al crear la solicitud de cancelación" || "Error al crear la solicitud de cancelación")
                setToastType('error')
            }).finally(() => { setLoading(false); })
        }
    };



    return (
        <>
            <FormNewCancellation
                loading={loading}
                modalType={modalType}
                showModal={showModal}
                handleSubmit={handleSubmit}
                handleConfirmAction={handleConfirmAction}
                handleCancel={handleCancel}
                handleCloseModal={handleCloseModal}
                loadData={loadData}
                setLoadData={setLoadData}
                handleInputChange={handleInputChange}
                hadleButtonClickBack={hadleButtonClickBack}
                setOptionStudent={setOptionStudent}
                optionStundent={optionStundent}
                setOptionAsignature={setOptionAsignature}
                optionAsignature={optionAsignature}
                mapNameStudent={mapNameStudent}
                mapNameSubjects={mapNameSubjects}
            />

            <CustomToast
                showToast={showToast}
                setShowToast={setShowToast}
                toastMessage={toastMessage}
                toastType={toastType}
            />
        </>
    );
}

export default NewCancellation;