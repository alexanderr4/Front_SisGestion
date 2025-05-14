
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

const ReportPdfReason = async (setDocumentPdf, setCanvas, fechaInicio, fechaFin, reason) => {

  const reports = await TypeReports(fechaInicio, fechaFin, reason);

  console.log("reports", reports);

  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 400;

  const ctx = canvas.getContext('2d');

  const data = {
    labels: reports.justification,
    datasets: [{
      label: "Motivo",
      data: reports.counts,
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1
    }]
  }

  const options = {
    responsive: false,
    animation: false,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Motivo'
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

  // 2. Crear el gráfico
  const chart = new Chart(ctx, {
    type: 'bar',
    data: data,
    options: options
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
  doc.setFontSize(20);
  doc.setFont(undefined, 'bold');
  const title = "Reporte General de cancelaciones ";
  const textWidth = doc.getTextWidth(title);
  const centerX = (pageWidth - textWidth) / 2;
  const titleY = margin + 10;
  doc.text(title, centerX, titleY);

  // 6. Preparar el texto del resumen
  doc.setFontSize(12);
  doc.setFont(undefined, 'normal');
  const motivosContados = reports?.justification.reduce((acc, item) => {
    const motivo = item;
    if (motivo) {
      acc[motivo] = (acc[motivo] || 0) + 1;
    }
    return acc;
  }, {});

  const motivosTexto = Object.keys(motivosContados)
    .map(motivo => `${motivo}: ${motivosContados[motivo]}`)
    .join('\n');

  const textoResumen = `Durante la fecha del ${fechaInicio} al ${fechaFin}, los motivos de las cancelaciones fueron:\n${motivosTexto}\n\nHa tenido un total de ${reports.counts.reduce((a, b) => a + b, 0)} cancelaciones.`;

  const maxTextWidth = pageWidth - 2 * margin;
  const textLines = doc.splitTextToSize(textoResumen, maxTextWidth);

  const textStartY = titleY + 10;
  const lineHeight = 6;
  const totalTextHeight = textLines.length * lineHeight;

  doc.text(textLines, margin, textStartY);

  // 7. Insertar imagen del gráfico según el espacio disponible
  const chartStartY = textStartY + totalTextHeight + 10;
  const availableHeight = pageHeight - chartStartY - margin;
  const availableWidth = pageWidth - 2 * margin;

  if (availableHeight > 100) { // espacio mínimo para que no se vea aplastado
    // Cabe en la misma página
    doc.addImage(imgData, 'PNG', margin, chartStartY, availableWidth, availableHeight);
  } else {
    // No cabe, crear una nueva página
    doc.addPage();
    doc.addImage(imgData, 'PNG', margin, margin, availableWidth, pageHeight - 2 * margin);
  }

  // 8. Crear el blob y la URL para vista previa
  const pdfBlob = doc.output('blob');
  const pdfUrl = URL.createObjectURL(pdfBlob);

  // 9. Pasar el PDF al estado
  setDocumentPdf({ blob: pdfBlob, url: pdfUrl });
  setCanvas({ data: data, options: options });

  // 10. Limpiar el gráfico para liberar memoria
  chart.destroy();
};

export default ReportPdfReason;
