import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Nav } from 'react-bootstrap';
import { Spinner } from 'react-bootstrap';
import CustomToast from '../../toastMessage/CustomToast';
import Parameters from './parameters/Parameters';
import Preview from './preview/Preview';
import Statistics from './statistics/Statistics';
import ReportPdfGeneral from './typeReports/generalReport/ReportPdfGeneral';
import ReportPdfSubject from './typeReports/reportPdfSubject/ReportPdfSubject';
import ReportPdfStudent from './typeReports/reportPdfStudent/ReportPdfSudent';
import ReportPdfReason from './typeReports/reportPdfReason/ReportPdfReason';
import './GenerateReport.css';
import { set } from 'date-fns';


function FormGenerateReport({
    hadleButtonClickBack,
}
) {

    const formatData = {
        reportType: '',
        outputFormat: 'opcion1',
        motivo: '',
        fechaInicio: '',
        fechaFin: '',
        asignatura: '',
        estudiante: ''
    }
    const [documentPdf, setDocumentPdf] = useState(null);
    const [activeTab, setActiveTab] = useState("parameters");
    const [formValues, setFormValues] = useState(formatData);
    const [canvas, setCanvas] = useState(null);
    const [showToast, setShowToast] = useState(false);     // Estado para mostrar/ocultar el Toast
    const [toastMessage, setToastMessage] = useState('');  // Estado para el mensaje del Toast
    const [toastType, setToastType] = useState('');
    const [loading, setLoading] = useState(false);
    const [linkDownload, setLinkDownload] = useState('');

    const validateForm = () => {
        const errors = [];
        const fechaInicioObj = new Date(formValues.fechaInicio);
        const fechaFinObj = new Date(formValues.fechaFin);
        if (!formValues.reportType) {
            errors.push("Debe seleccionar un tipo de reporte.");
        }
        if (!formValues.fechaInicio) {
            errors.push("Debe seleccionar una fecha de inicio.");
        }
        if (!formValues.fechaFin) {
            errors.push("Debe seleccionar una fecha de fin.");
        }
        if (fechaInicioObj >= fechaFinObj) {
            errors.push("La fecha de inicio debe ser anterior a la fecha de fin.");
        }

        // Agrega otras validaciones si deseas
        return errors;
    };

    const handleGenerate = () => {
        const actualDate = new Date();
        const pad = (num) => num.toString().padStart(2, '0');
        const formattedDate = `${pad(actualDate.getDate())}-${pad(actualDate.getMonth() + 1)}-${actualDate.getFullYear()}`;
        const formattedTime = `${pad(actualDate.getHours())}${pad(actualDate.getMinutes())}`;

        const errors = validateForm();
        try {
            if (errors.length > 0) {
                alert("Corrige los siguientes errores:\n" + errors.join("\n"));

            } else {
                setLoading(current => { return true });
                switch (formValues.reportType) {
                    case "opcion1":
                        ReportPdfGeneral(setDocumentPdf, setCanvas, formValues.fechaInicio, formValues.fechaFin);
                        setLinkDownload(`Reporte_General_${formattedDate}_${formattedTime}.pdf`);
                        break;
                    case "opcion2":
                        ReportPdfSubject(setDocumentPdf, setCanvas, formValues.fechaInicio, formValues.fechaFin, formValues.asignatura);
                        setLinkDownload(`Reporte_Asignatura_${formattedDate}_${formattedTime}.pdf`);
                        break;
                    case "opcion3":
                        ReportPdfStudent(setDocumentPdf, setCanvas, formValues.fechaInicio, formValues.fechaFin, formValues.estudiante);
                        setLinkDownload(`Reporte_Estudiante_${formattedDate}_${formattedTime}.pdf`);
                        break
                    case "opcion4":
                        ReportPdfReason(setDocumentPdf, setCanvas, formValues.fechaInicio, formValues.fechaFin, formValues.motivo);
                        setLinkDownload(`Reporte_Motivo_${formattedDate}_${formattedTime}.pdf`);
                        break;
                    default:
                }
                setTimeout(() => {
                    // setLoading(false);
                    // setShowToast(true);
                    setFormValues(formatData);
                    setActiveTab("preview");
                    setToastMessage(`se generó el reporte`);
                    setToastType('success');
                }, 2000);
            }
        } catch (error) {
            setShowToast(true);
            setToastMessage(`Error al generar el reporte`);
            setActiveTab('parameters')
            setToastType('error');
        }
    }

    const handleCancel = () => {
        setFormValues(formatData);
        setDocumentPdf(null);
        setCanvas(null);
        setActiveTab("parameters");
    }

    const handleDownload = () => {
        if (!documentPdf) return;
        const link = document.createElement('a');
        link.href = URL.createObjectURL(documentPdf.blob);
        link.download = linkDownload || 'reporte.pdf'; // Nombre por defecto si no se ha establecido
        link.click();
    };

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
                    <Nav className='custom-sub-menu-report' variant="tabs" activeKey={activeTab} onSelect={(selectedKey) => setActiveTab(selectedKey)}>
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
                    {activeTab === "parameters" && (
                        <Parameters formValues={formValues} setFormValues={setFormValues} />
                    )}

                    {activeTab === "preview" && (
                        <Preview document={documentPdf} 
                        setLoading = {setLoading}
                        loading = {loading}
                        setShowToast = {setShowToast}
                        />
                    )}

                    {activeTab === "statistics" && (
                        <Statistics
                            canvas={canvas}
                        />
                    )}
                </div>

                <div className="row content-button">
                    <div className='col-md-6 col-3 format-button-one' >
                        <button onClick={handleCancel}>Cancelar</button>
                    </div>
                    <div className='col-md-6 col-9 format-button-second' >
                        <button onClick={handleDownload}>Exportar</button>
                        <button className='button-generate-report' onClick={handleGenerate} >Generar Reporte</button>
                    </div>
                </div>
            </div>
            <CustomToast
                showToast={showToast}
                setShowToast={setShowToast}
                toastMessage={toastMessage}
                toastType={toastType}
            />
            {loading && (
                <div className="loading-overlay">
                    <Spinner animation="grow" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </Spinner>
                </div>
            )}

        </div >
    );
}

export default FormGenerateReport;