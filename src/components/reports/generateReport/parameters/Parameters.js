import './Parameters.css';

function Parameters() {
    return (
        <div className="">
            <div className="row">
                <div className="form-section col-md-6">
                    <label>Tipo de reporte</label>
                    <select id="mySelect"
                    // value={selectedOption} 
                    // onChange={handleChange}
                    >
                        <option value="">Elije una opción</option>
                        <option value="opcion1">Reporte General</option>
                        <option value="opcion2">Por Asignatura</option>
                        <option value="opcion3">Por Estudiante</option>
                        <option value="opcion4">Por Motivo</option>
                    </select>
                </div>
                <div className="form-section col-md-6">
                    <label>Formato de salida</label>
                    <select id="mySelect"
                    // value={selectedOption} 
                    // onChange={handleChange}
                    >
                        <option value="">Elije una opción</option>
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
                        name="nombreEstudiante"
                        id='nombreEstudiante'
                        placeholder="Nombre Completo"
                        // onChange={handleChangeSelect}
                        // value={loadData.nombreEstudiante}

                        required

                    />
                </div>
                <div className="form-section col-md-6">
                    <label>Fecha de Fin</label>
                    <input
                        type="date"
                        name="nombreEstudiante"
                        id='nombreEstudiante'
                        placeholder="Nombre Completo"
                        // onChange={handleChangeSelect}
                        // value={loadData.nombreEstudiante}

                        required

                    />
                </div>
            </div>
            <div className="row">
                <div className="form-section col-md-6">
                    <label>Asignatura (Opcional)</label>
                    <input
                        type="text"
                        name="nombreEstudiante"
                        id='nombreEstudiante'
                        placeholder="Nombre Completo"
                    // onChange={handleChangeSelect}
                    // value={loadData.nombreEstudiante}



                    />
                </div>
                <div className="form-section col-md-6">
                    <label>Estudiante (Opcional)</label>
                    <input
                        type="text"
                        name="nombreEstudiante"
                        id='nombreEstudiante'
                        placeholder="Nombre Completo"
                    // onChange={handleChangeSelect}
                    // value={loadData.nombreEstudiante}



                    />
                </div>
            </div>

            
        </div>
    );
}

export default Parameters;