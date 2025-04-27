import { useState } from "react";
import {getCancellations} from "../../../../api/Cancellations";
import "./Summary.css";


function Summary() {
    const [loading, setLoading] = useState(true);
    const calculatePendingCancellations =() => {
        setLoading(true);
        const requests = getCancellations().then((response) => {

        })
        .catch((error) => {
            console.error("Error fetching data:", error);
        })
        .finally(() => {
            setLoading(false);
        });
    }

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