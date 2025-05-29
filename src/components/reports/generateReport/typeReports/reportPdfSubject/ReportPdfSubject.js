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
import autoTable from 'jspdf-autotable'; // Añadido para tabla
import Chart from 'chart.js/auto';
import TypeReports from './TypeReports';

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

const ReportPdfSubject = async (setDocumentPdf, setCanvas, fechaInicio, fechaFin, nameSubject) => {
  const reports = await TypeReports(fechaInicio, fechaFin, nameSubject);

  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 400;
  const ctx = canvas.getContext('2d');

  const subjectCount = reports.subjects.length;

  const data = {
    labels: reports.subjects,
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
  };

  const options = {
    responsive: false,
    animation: false,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Grupo'
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
  };

  const chart = new Chart(ctx, {
    type: 'bar',
    data: data,
    options: options
  });

  await new Promise(resolve => setTimeout(resolve, 500));
  const imgData = canvas.toDataURL('image/png');

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const textMargin = 10;

  const getFormattedDate = () => {
    const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto',
      'septiembre', 'octubre', 'noviembre', 'diciembre'];
    const fecha = new Date();
    return `${fecha.getDate()} de ${meses[fecha.getMonth()]} de ${fecha.getFullYear()}`;
  };

  const currentDate = getFormattedDate();

  // --- Encabezado con fecha ---
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text(currentDate, pageWidth - margin, margin, { align: 'right' });

  // --- Título principal ---
  doc.setFontSize(20);
  doc.setFont(undefined, 'bold');
  const title = "Reporte de cancelaciones por asignatura";
  const titleWidth = doc.getTextWidth(title);
  const centerX = (pageWidth - titleWidth) / 2;
  doc.text(title, centerX, margin + textMargin);

  // --- Párrafo introductorio ---

  const totalCancelaciones = reports.approved.reduce((a, b) => a + b, 0) +
    reports.pending.reduce((a, b) => a + b, 0) +
    reports.rejected.reduce((a, b) => a + b, 0);

  const totalAprobadas = reports.approved.reduce((a, b) => a + b, 0);
  const totalPendientes = reports.pending.reduce((a, b) => a + b, 0);
  const totalRechazadas = reports.rejected.reduce((a, b) => a + b, 0);

  doc.setFontSize(12);
  doc.setFont(undefined, 'normal');
  const introText = reports.subjects.length === 1 ? `Durante el periodo del ${fechaInicio} al ${fechaFin}, la asignatura "${reports?.subjects[0] || ""}" ha registrado un total de ${totalCancelaciones} cancelaciones distribuidas en ${totalAprobadas} aprobadas, ${totalPendientes} pendientes y ${totalRechazadas} rechazadas. A continuación, se presenta el detalle de las cancelaciones y una gráfica representativa.` :
    `Durante el periodo del ${fechaInicio} al ${fechaFin}, se registró un total de ${totalCancelaciones} cancelaciones en las asignaturas consultadas, distribuidas en ${totalAprobadas} aprobadas, ${totalPendientes} pendientes y ${totalRechazadas} rechazadas. Según las asignaturas seleccionadas, se identificaron un total de ${reports.subjects.length} asignaturas con al menos una solicitud de cancelación. A continuación, se presenta el detalle por asignatura y una gráfica representativa.`;

  const maxTextWidth = pageWidth - 2 * margin;
  const lines = doc.splitTextToSize(introText, maxTextWidth);
  doc.text(lines, margin, margin + 2 * textMargin);

  // --- Tabla de datos ---
  const tableTitle = "Detalle de cancelaciones por grupo";
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  const tableTitleWidth = doc.getTextWidth(tableTitle);
  const paragraphHeight = lines.length * 7;
  const tableTitleY = margin + 2 * textMargin + paragraphHeight + 10;
  doc.text(tableTitle, (pageWidth - tableTitleWidth) / 2, tableTitleY);

  autoTable(doc, {
    head: [['#', 'Asignatura', 'Aprobadas', 'Pendientes', 'Rechazadas', 'Total cancelaciones']],
    body: reports.subjects.map((subject, i) => [
      i + 1,
      subject,
      reports.approved[i] || 0,
      reports.pending[i] || 0,
      reports.rejected[i] || 0,
      reports.approved[i] || 0 + reports.pending[i] || 0 + reports.rejected[i] || 0,
    ]),
    startY: tableTitleY + 5,
    theme: 'striped',
    margin: { left: margin, right: margin },
    headStyles: {
      fillColor: [63, 81, 181],
      textColor: 255,
      fontStyle: 'bold'
    }
  });

  const tableEndY = doc.lastAutoTable.finalY || (tableTitleY + 30);

  // --- Título para la gráfica ---
  const chartTitle = "Gráfica de cancelaciones por grupo";
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  const chartTitleWidth = doc.getTextWidth(chartTitle);
  const chartTitleY = tableEndY + 10;
  doc.text(chartTitle, (pageWidth - chartTitleWidth) / 2, chartTitleY);

  // --- Insertar imagen del gráfico ---
  const chartWidth = pageWidth - 2 * margin;
  const chartHeight = 80;
  const chartY = chartTitleY + 5;

  if (pageHeight - (chartY + chartHeight) < margin) {
    doc.addPage();
    doc.text(chartTitle, (pageWidth - chartTitleWidth) / 2, margin);
    doc.addImage(imgData, 'PNG', margin, margin + 7, chartWidth, chartHeight);
  } else {
    doc.addImage(imgData, 'PNG', margin, chartY, chartWidth, chartHeight);
  }

  // --- Finalizar PDF ---
  const pdfBlob = doc.output('blob');
  const pdfUrl = URL.createObjectURL(pdfBlob);
  setDocumentPdf({ blob: pdfBlob, url: pdfUrl });
  setCanvas({ data: data, options: options });
  chart.destroy();
};

export default ReportPdfSubject;
