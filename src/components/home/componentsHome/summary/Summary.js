import "./Summary.css";

function Summary() {
    return (

        <div className='row'>
            <div className="col-md-6 col-12 content-wrapper" >
                <div className="row content-targets"  >
                    <div className="col-12 col-md-6 target-group">
                        <div className="card-summary">
                            <h5>Cancelaciones pendientes</h5>
                            {/* {loading ? (
                                    <Spinner animation="border" size="sm" /> // Muestra el spinner mientras carga
                                ) : (
                                    <p>{requests.length}</p> // Muestra los datos una vez cargados
                                )} */}
                        </div>


                        <div className="card-summary">
                            <h5>Electivas Registradas</h5>
                            {/* {loading ? (
                                    <Spinner animation="border" size="sm" /> // Muestra el spinner mientras carga
                                ) : (
                                    <p>{requestsPending}</p> // Muestra los datos una vez cargados
                                )} */}

                        </div>
                    </div>
                    <div className="col-12 col-md-6 target-group">

                        <div className="card-summary">
                            <h5>Cancelaciones aprobadas</h5>
                            {/* {loading ? (
                                    <Spinner animation="border" size="sm" /> // Muestra el spinner mientras carga
                                ) : (
                                    <p>{equipments}</p> // Muestra los datos una vez cargados
                                )} */}
                        </div>


                        <div className="card-summary">
                            <h5>Etudiantes activos</h5>
                            {/* {loading ? (
                                    <Spinner animation="border" size="sm" /> // Muestra el spinner mientras carga
                                ) : (
                                    <p>{UserActive}</p> // Muestra los datos una vez cargados
                                )} */}
                        </div>

                    </div>
                </div>

                <div className="content-recent-activity">
                    <h5>Actividad reciente</h5>
                    <p>faBars</p>
                    <p>faBars</p>
                </div>
            </div>
            <div className="col-md-6 col-12 content-statistics">
                <h5>Estadisticas de cancelaciones</h5>
                <p>faBars</p>
                <p>faBars</p>
                <p>faBars</p>
                <p>faBars</p>
                <p>faBars</p>
                <p>faBars</p>
                <p>faBars</p>
                <p>faBars</p>
            </div>
        </div>

    );
}

export default Summary;