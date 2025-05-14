
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
} from 'chart.js';
import { jsPDF } from 'jspdf';

import Chart from 'chart.js/auto';

import TypeReports from './TypeReports';

// 2. Registrar los elementos de Chart.js
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
);



// Configuración de Chart.js
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const ReportPdfStudent = async (setDocumentPdf,  fechaInicio, fechaFin, nameStudent ) => {

  const reports = await TypeReports( fechaInicio, fechaFin, nameStudent);

  console.log("reports", reports);

  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 400;

  const ctx = canvas.getContext('2d');

  // 2. Crear el gráfico
  const chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: [`${reports?.studentNameActual || ""}`],
      datasets: [{
        label: reports?.studentNameActual || "",
        data: reports.counts,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: false,
      animation: false,
      scales: {
        x: {
          title: {
            display: true,
            text: 'Estudiante'
          }
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Cantidad de Cancelaciones'
          },
          ticks: {
            stepSize: 1
          }
        }
      }
    }
  });

  // Espera que el gráfico termine de renderizar
  await new Promise(resolve => setTimeout(resolve, 500));

  // 3. Convertir el gráfico a imagen
  const imgData = canvas.toDataURL('image/png');

  // 4. Crear PDF en orientación horizontal
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

  // Obtener dimensiones de la página
  const pageWidth = doc.internal.pageSize.getWidth();   // ~297 mm
  const pageHeight = doc.internal.pageSize.getHeight(); // ~210 mm
  const margin = 20;

  // 5. Insertar texto
  const textMargin = 10;
  doc.setFontSize(20); // Tamaño de fuente grande
  doc.setFont(undefined, 'bold'); // Estilo negrita (opcional)

  const title = "Reporte por estudiante de cancelaciones ";
  const textWidth = doc.getTextWidth(title);
  const centerX = (pageWidth - textWidth) / 2;

  doc.text(title, centerX, margin + textMargin);

  // Restaurar tamaño de fuente para el resto del texto
  doc.setFontSize(12);
  doc.setFont(undefined, 'normal');
  doc.text(`Durante la fecha del ${fechaInicio} al ${fechaFin} el/la estudiante ${reports?.studentNameActual || ""} ha tenido ${reports.counts.reduce((acumulador, actual) => acumulador + actual, 0)} cancelaciones`, margin, margin + 2 * textMargin);

  // 6. Calcular tamaño disponible para el gráfico (el resto de la página después del texto)
  const availableWidth = pageWidth - 2 * margin; // Ancho de la página menos márgenes
  const availableHeight = pageHeight - (margin + 6 * textMargin); // Resto de la altura

  // 7. Insertar imagen del gráfico en el espacio disponible
  doc.addImage(imgData, 'PNG', margin, margin + 3 * textMargin, availableWidth, availableHeight);

  // 8. Crear el blob y la URL para vista previa
  const pdfBlob = doc.output('blob');
  const pdfUrl = URL.createObjectURL(pdfBlob);

  // 9. Pasar el PDF al estado
  setDocumentPdf({ blob: pdfBlob, url: pdfUrl });

  // 10. Limpiar el gráfico para liberar memoria
  chart.destroy();
};

export default ReportPdfStudent;
