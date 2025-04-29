import { useState, useRef, useEffect } from "react";
import { useNavigate, Outlet, data } from 'react-router-dom';
import FormNewCancellation from "./FormNewCancellation";
import { getStudents } from "../../../api/Students";
import { getElectives } from "../../../api/Electives";
import { createCancellation } from "../../../api/Cancellations";
import CustomToast from '../../toastMessage/CustomToast';
import { set } from "date-fns";

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
            await fetchAndStoreData(getElectives, dataElectives);
            await fetchAndStoreData(getStudents, dataStudents);
        }

        fetch();
    }, []);

    const fetchAndStoreData = async (fetchFunction, dataRef) => {
        try {
            setLoading(true);
            const response = await fetchFunction();
            dataRef.current = response.data;
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const mapNameStudent = () => {
        return dataStudents.current && dataStudents.current.data ? dataStudents.current.data : []
    }

    const mapNameSubjects = () => {
        return dataElectives.current && dataElectives.current.data ? dataElectives.current.data : []
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
                justification: loadData.justification,
                comments: loadData.comments
            }
            createCancellation(sendData).then((response) => {
                setLoading(false);
                setShowToast(true)
                setToastMessage("Solicitud de cancelación creada con éxito")
                setToastType('success')
                setLoadData(formData);
              
            }).catch((error) => {
                setLoading(false);
                console.log(error, "error enviar solicitud")
                setShowToast(true)
                setToastMessage("Error al crear la solicitud de cancelación")
                setToastType('error')
             }).finally(() => {   setLoading(false);})

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