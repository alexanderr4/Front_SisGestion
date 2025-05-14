import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

// Registramos los componentes que usaremos
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const GraphTwo = ({ data, electives }) => {
    const countElectivas = new Array(electives.length).fill(0);
    data.forEach(c => {
        const index = electives.findIndex(e => e.id === c.subject.id);
        if (index !== -1) {
            countElectivas[index]++;
        }
    });

    // Obtener los nombres de las electivas
    const nombresElectivas = electives.map(e => e.name);

    console.log("Nombres de las electivas:", nombresElectivas);
    console.log("Cantidad de repeticiones por electiva:", countElectivas);

    const chartData = {
        labels: nombresElectivas, // Etiquetas del eje X
        datasets: [
            {
                label: 'Cancelaciones', // Etiqueta del conjunto de datos
                data: countElectivas, // Valores de las barras
                backgroundColor: 'rgba(75, 192, 192, 0.2)', // Color de las barras
                borderColor: 'rgba(75, 192, 192, 1)', // Color del borde de las barras
                borderWidth: 1
            }
        ]
    };

    // Opciones de configuración del gráfico
    const options = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Gráfico de cancelaciones de electivas'
            },
            tooltip: {
                callbacks: {
                    label: (tooltipItem) => {
                        return `${tooltipItem.dataset.label}: ${tooltipItem.raw}`;
                    }
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    maxRotation: 90,
                    minRotation: 90
                }
            },
            y: {
              title: {
                display: true,
                text: 'Cantidad'
              },
            }
        }

    };

    return (
        <div>
            <Bar data={chartData} options={options} />
        </div>
    );
};

export default GraphTwo;