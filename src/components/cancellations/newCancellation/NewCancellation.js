import { useState } from "react";
import { useNavigate, Outlet } from 'react-router-dom';
import FormNewCancellation from "./FormNewCancellation";


function NewCancellation() {

    const [loading, setLoading ] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('');  
    const navigate = useNavigate();
    
    const formData ={
        codigoEstudiante: "",
        nombreEstudiante: "",
        codigoAsignatura: "",
        nombreAsignatura: "",
        grupoAsignatura: "",
        creditosAsignatura: "",
        tipeAsignatura: "",
        descripcion : ""

    }

    const [loadData, setLoadData] = useState(formData);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLoadData({
            ...loadData,
            [name] : value,
        });
    };

    const hadleButtonClickBack = () => {
        navigate(-1)
    }
    

    const handleSubmit = (e) => {
        console.log('handleSubmit')
        e.preventDefault();
        setModalType('register');
        setShowModal(true);
        
    };

    const handleCancel = () => {
        setModalType('cancel');  // Definimos el tipo de acción como cancelar
        setShowModal(true);      // Mostramos el modal
    };

    const handleCloseModal = () => {
        setShowModal(false); // Cerrar el modal sin realizar acción
    };

    const handleConfirmAction = async () => {
        setShowModal(false);  // Cerramos el modal primero
        setLoading(true);
        if (modalType === 'cancel') {
         
            setLoading(false);  // Detenemos el spinner
            // Mostramos el componente ListUsers
        } else if (modalType === 'register') {
            setTimeout(() => {
                setLoading(false);  // Detenemos el spinner después de 2 segundos
            }, 2000);
          
            console.log(loadData)
            
        }
    };


    return (
        <FormNewCancellation
            loading={loading}
            modalType={modalType}
            showModal={showModal}
            handleSubmit={handleSubmit}
            handleConfirmAction={handleConfirmAction}
            handleCancel={handleCancel}
            handleCloseModal={handleCloseModal}
            loadData = {loadData}
            setLoadData = {setLoadData}
            handleInputChange={handleInputChange}
            hadleButtonClickBack={hadleButtonClickBack}
        />
    );
}

export default NewCancellation;