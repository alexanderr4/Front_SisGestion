import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import ConfirmationModal from "../../ConfirmationModal/ConfirmationModal";
import { Nav, Spinner } from 'react-bootstrap';
import './GenerateReport.css';
import Parameters from './parameters/Parameters';
import Preview from './preview/Preview';


function FormGenerateReport({
    handleSubmit,
    handleInputChange,
    loadData,
    setLoadData,
    hadleButtonClickBack,
    handleCancel,
    loading,
    setLoading }
) {

    const [activeTab, setActiveTab] = useState("parameters");
    return (
        <div className='content-generate-report'>
            <div className='content-title'>
                <button onClick={() => hadleButtonClickBack()}> <FontAwesomeIcon className="icon-faArrowLeft" icon={faArrowLeft} /> </button>
                <h3>Reportes de Cancelaciones</h3>
            </div>

            <div className='content-formulary'>
                <h3>Generación de reportes</h3>
                <p>Configure los parametros para generar reportes de cancelación</p>
                <div className='content-sub-menu-report'>
                    <Nav className='custom-sub-menu' variant="tabs" activeKey={activeTab} onSelect={(selectedKey) => setActiveTab(selectedKey)}>
                        <Nav.Item>
                            <Nav.Link eventKey="parameters">Parámetros</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="preview">Vista Previa</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="statistics">Estadísticas</Nav.Link>
                        </Nav.Item>

                    </Nav>
                </div>

                <div className='variable-content'>
                    {
                        activeTab === "parameters" ? (
                            <Parameters />
                        ) : (
                            <Preview />
                        )
                    }

                </div>

                <div className="row content-button">
                    <div className='col-md-6 format-button-one' >
                        <button >cancelar</button>
                    </div>
                    <div className='col-md-6 format-button-second' >
                        <button  >Exportar</button>
                        <button className='button-generate-report' >Generar Reporte</button>
                    </div>
                </div>


            </div>

        </div >
    );
}

export default FormGenerateReport;