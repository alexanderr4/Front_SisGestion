import { useState } from 'react';
import './Parameters.css';

function Parameters({ formValues, setFormValues }) {

    // const [formValues, setFormValues] = useState({
    //     reportType: '',
    //     outputFormat: 'opcion1',
    //     motivo: '',
    // });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues((prev) => ({
            ...prev,
            [name]: value
        }));
    };
    return (
        <div className="">
            <div className="row">
                <div className="form-section col-md-6">
                    <label>Tipo de reporte</label>
                    <select id="mySelect"
                        name="reportType"
                        value={formValues.reportType}
                        onChange={handleChange}
                        required
                    >
                        <option value="" disabled>Elije una opción</option>
                        <option value="opcion1">Reporte General</option>
                        <option value="opcion2">Por Asignatura</option>
                        <option value="opcion3">Por Estudiante</option>
                        <option value="opcion4">Por Motivo</option>
                    </select>
                </div>
                <div className="form-section col-md-6">
                    <label>Formato de salida</label>
                    <select id="mySelect"
                        name='outputFormat'
                        value={formValues.outputFormat}
                        onChange={handleChange}
                        disabled
                    >
                        <option value="" disabled>Elije una opción</option>
                        <option value="opcion1">PDF</option>
                        <option value="opcion2">Excel</option>
                        <option value="opcion3">CSV</option>
                    </select>
                </div>
            </div>
            <div className="row">
                <div className="form-section col-md-6">
                    <label>Fecha de Inicio</label>
                    <input
                        type="date"
                        name="fechaInicio"
                        id='nombreEstudiante'
                        placeholder="Nombre Completo"
                        onChange={handleChange}
                        value={formValues.fechaInicio}

                        required

                    />
                </div>
                <div className="form-section col-md-6">
                    <label>Fecha de Fin</label>
                    <input
                        type="date"
                        name="fechaFin"
                        id='nombreEstudiante'
                        placeholder="Nombre Completo"
                        onChange={handleChange}
                        value={formValues.fechaFin}

                        required

                    />
                </div>
            </div>
            <div className="row">
                <div className="form-section col-md-6">
                    <label>Asignatura (Opcional)</label>
                    <input
                        type="text"
                        name="asignatura"
                        id='nombreEstudiante'
                        placeholder="Nombre Completo"
                        onChange={handleChange}
                        value={formValues.asignatura}
                    />
                </div>
                <div className="form-section col-md-6">
                    <label>Estudiante (Opcional)</label>
                    <input
                        type="text"
                        name="estudiante"
                        id='nombreEstudiante'
                        placeholder="Nombre Completo"
                        onChange={handleChange}
                        value={formValues.estudiante}
                    />
                </div>
            </div>


        </div>
    );
}

export default Parameters;