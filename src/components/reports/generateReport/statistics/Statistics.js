import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartPie } from '@fortawesome/free-solid-svg-icons';
import { Bar } from 'react-chartjs-2';
import './Statistics.css';

function Statistics({ canvas }) {
    return (
        <div className="report-cancel-satistics">

            {canvas === null ? (<>
                <FontAwesomeIcon className="icon-faSheetPlastic-preview" icon={faChartPie} />
                <p>Configure los parámetros y genere el reporte para ver las Estadísticas</p>
            </>
            ) : (
                <>
                    <h3>Estadísticas</h3>
                    <div className='content-statistics-grphic'>
                        <Bar data={canvas.data} options={canvas.options} height={300} width={900} />
                    </div>

                </>
            )}

        </div>
    )

};

export default Statistics;