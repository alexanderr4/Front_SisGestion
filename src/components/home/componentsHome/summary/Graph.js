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

const Graph = ({ data }) => {
  const statusCount = {
    approved: 0,
    pending: 0,
    rejected: 0
  };

  // Recorrer los datos y contar según el estado
  data.forEach(item => {
    if (item.status === 'approved') {
      statusCount.approved += 1;
    } else if (item.status === 'pending') {
      statusCount.pending += 1;
    } else if (item.status === 'rejected') {
      statusCount.rejected += 1;
    }
  });

  // Retornar dos arreglos: los estados y las cantidades
  const statuses = ['approved', 'pending', 'rejected'];
  const counts = statuses.map(status => statusCount[status]);
  const dtaFinal = ['aprobado', 'pendiente', 'rechazado'];

  const chartData = {
    labels: dtaFinal, // Etiquetas del eje X
    datasets: [
      {
        label: 'Cancelaciones', // Etiqueta del conjunto de datos
        data: counts, // Valores de las barras
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
        text: 'Gráfico estados de las Cancelaciones'
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
        title: {
          display: true,
          text: 'Estados'
        },
      },
      y:{
        title: {
          display: true,
          text: 'Cantidad'
        },
        beginAtZero: true
      }
    }
  };

  return (
    <div>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default Graph;
