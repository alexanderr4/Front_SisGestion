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
import autoTable from 'jspdf-autotable';
import Chart from 'chart.js/auto';
import TypeReports from './TypeReports';

// Registrar elementos necesarios para ChartJS
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

const ReportPdfReason = async (setDocumentPdf, setCanvas, fechaInicio, fechaFin, reason) => {
  // Obtener datos desde el backend
  const reports = await TypeReports(fechaInicio, fechaFin, reason);
  // Crear canvas para la gráfica
  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 400;
  const ctx = canvas.getContext('2d');
  const subjectCount = reports.justification.length;
  // Configurar datos y opciones del gráfico
  const data = {
    labels: reports.justification,
    datasets: [
      {
        label: 'Aprobadas',
        data: reports.approved,
        backgroundColor: 'rgba(104, 177, 45, 0.6)',
        stack: 'Estado',
        barThickness: subjectCount <= 3 ? 50 : undefined
      },
      {
        label: 'Pendientes',
        data: reports.pending,
        backgroundColor: 'rgba(204, 235, 30, 0.6)',
        stack: 'Estado',
        barThickness: subjectCount <= 3 ? 50 : undefined
      },
      {
        label: 'Rechazadas',
        data: reports.rejected,
        backgroundColor: 'rgba(250, 61, 61, 0.6)',
        stack: 'Estado',
        barThickness: subjectCount <= 3 ? 50 : undefined
      }
    ]
  }

  const options = {
    responsive: false,
    animation: false,
    scales: {
      x: {
        title: { display: true, text: 'Motivo' },
        ticks: {
          minRotation: 90,
          maxRotation: 90
        }
      },
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Cantidad de Cancelaciones' },
        ticks: { stepSize: 1, },
      }
    }
  }

  // Crear el gráfico
  const chart = new Chart(ctx, {
    type: 'bar',
    data: data,
    options: options
  });

  // Esperar a que se renderice el gráfico
  await new Promise(resolve => setTimeout(resolve, 500));
  const imgData = canvas.toDataURL('image/png');

  // Inicializar documento PDF
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;

  // -------------------------------------
  // ENCABEZADO CON FECHA Y TÍTULO
  // -------------------------------------

  const getFormattedDate = () => {
    const meses = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    const fecha = new Date();
    const dia = fecha.getDate();
    const mes = meses[fecha.getMonth()];
    const año = fecha.getFullYear();
    return `${dia} de ${mes} de ${año}`;
  };
  const currentDate = getFormattedDate();

  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text(currentDate, pageWidth - margin, margin, { align: 'right' });
  const textMargin = 10;
  doc.setFontSize(20); // Tamaño de fuente grande
  doc.setFont(undefined, 'bold'); // Estilo negrita (opcional)

  const title = "Reporte de cancelaciones por motivo";
  const textWidth = doc.getTextWidth(title);
  const centerX = (pageWidth - textWidth) / 2;

  doc.text(title, centerX, margin + textMargin);

  // Restaurar tamaño de fuente para el resto del texto
  doc.setFontSize(12);
  doc.setFont(undefined, 'normal');

  // -------------------------------------
  // PÁRRAFO INTRODUCTORIO
  // -------------------------------------
  const totalCancelaciones = reports.approved.reduce((a, b) => a + b, 0) +
    reports.pending.reduce((a, b) => a + b, 0) +
    reports.rejected.reduce((a, b) => a + b, 0);

  const totalAprobadas = reports.approved.reduce((a, b) => a + b, 0);
  const totalPendientes = reports.pending.reduce((a, b) => a + b, 0);
  const totalRechazadas = reports.rejected.reduce((a, b) => a + b, 0);

const paragraph = `Durante el periodo del ${fechaInicio} al ${fechaFin}, se ha registrado un total de ${totalCancelaciones} cancelaciones, distribuidas en ${totalAprobadas} aprobadas, ${totalPendientes} pendientes y ${totalRechazadas} rechazadas. Estas cancelaciones se clasifican en ${reports.justification.length} motivos diferentes. Este informe presenta una visualización gráfica de dicha distribución.`;

  // Define ancho máximo del texto según márgenes
  const maxTextWidth = pageWidth - 2 * margin;

  // Divide el texto en líneas ajustadas al ancho permitido
  const lines = doc.splitTextToSize(paragraph, maxTextWidth);

  // Escribir el texto en múltiples líneas (alineado a la izquierda)
  doc.setFontSize(12);
  doc.setFont(undefined, 'normal');
  doc.text(lines, margin, margin + 2 * textMargin);

  // -------------------------------------
  // TABLA DE DATOS
  // -------------------------------------


  const tableTitle = 'Distribución detallada de cancelaciones por motivo';
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  const tableTitleWidth = doc.getTextWidth(tableTitle);
  const tableTitleX = (pageWidth - tableTitleWidth) / 2;
  const tableTitleY = margin + 5 * textMargin - 5; // Un poco antes del inicio de la tabla
  doc.text(tableTitle, tableTitleX, tableTitleY);

  const lineHeight = 7; // en mm, puede variar según el tamaño de fuente y fuente
  const paragraphHeight = lines.length * lineHeight;

  const startY = margin + 2 * textMargin + paragraphHeight + 10;
  autoTable(doc, {
    head: [['#', 'Motivo', 'Aprobado', 'Pendiente', 'Rechazado', 'Total de cancelaciones']],
    body: reports.justification.map((justif, index) => [
      index + 1,
      justif,
      reports.approved[index] || 0,
      reports.pending[index] || 0,
      reports.rejected[index] || 0,
      (reports.approved[index] || 0) + (reports.pending[index] || 0) + (reports.rejected[index] || 0)
    ]),
    startY: startY,
    theme: 'striped',
    margin: { left: margin, right: margin },
    headStyles: {
      fillColor: [63, 81, 181],
      textColor: 255,
      fontStyle: 'bold'
    }
  });

  const tableEndY = doc.lastAutoTable.finalY || startY + 20;


  // -------------------------------------
  // TÍTULO DE LA GRÁFICA
  // -------------------------------------

  const chartTitle = 'Gráfica de Cancelaciones por Motivo';
  const chartTitleWidth = doc.getTextWidth(chartTitle);
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');

  // Separación extra debajo de la tabla
  const spaceAfterTable = 10;

  const chartTitleY = tableEndY + spaceAfterTable;
  doc.text(chartTitle, (pageWidth - chartTitleWidth) / 2, chartTitleY);

  // -------------------------------------
  // IMAGEN DE LA GRÁFICA
  // -------------------------------------

  const chartWidth = 140;
  const chartHeight = 80;
  const chartY = chartTitleY + 5;  // un poco debajo del título
  const centerXChart = (pageWidth - chartWidth) / 2;

  // Verificar si hay espacio para la gráfica, si no, nueva página
  if (pageHeight - (chartY + chartHeight) < margin) {
    doc.addPage();
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text(chartTitle, (pageWidth - chartTitleWidth) / 2, margin);
    doc.addImage(imgData, 'PNG', centerXChart, margin + 7, chartWidth, chartHeight);
  } else {
    doc.addImage(imgData, 'PNG', centerXChart, chartY, chartWidth, chartHeight);
  }

  // -------------------------------------
  // CREAR PDF Y PASARLO A LA INTERFAZ
  // -------------------------------------

  const pdfBlob = doc.output('blob');
  const pdfUrl = URL.createObjectURL(pdfBlob);

  setDocumentPdf({ blob: pdfBlob, url: pdfUrl });
  setCanvas({ data: data, options: options });

  // Limpiar el gráfico para liberar memoria
  chart.destroy();
};

export default ReportPdfReason;
