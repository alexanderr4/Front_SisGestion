
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

const ReportPdfGeneral = async (setDocumentPdf, setCanavas, fechaInicio, fechaFin) => {

  const reports = await TypeReports(fechaInicio, fechaFin);

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
  }

  const options = {
    responsive: false,
    animation: false,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Asignaturas'
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
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  // Obtener dimensiones de la página
  const pageWidth = doc.internal.pageSize.getWidth();   // ~297 mm
  const pageHeight = doc.internal.pageSize.getHeight(); // ~210 mm
  const margin = 20;

  // facha actual

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
  const dateWidth = doc.getTextWidth(currentDate);
  doc.text(currentDate, pageWidth - margin, margin, { align: 'right' });

  // 5. Insertar texto
  const textMargin = 10;
  doc.setFontSize(20); // Tamaño de fuente grande
  doc.setFont(undefined, 'bold'); // Estilo negrita (opcional)

  const title = "Reporte general de cancelaciones";
  const textWidth = doc.getTextWidth(title);
  const centerX = (pageWidth - textWidth) / 2;

  doc.text(title, centerX, margin + textMargin);

  // Restaurar tamaño de fuente para el resto del texto
  const totalCancelaciones = reports.approved.reduce((a, b) => a + b, 0) +
    reports.pending.reduce((a, b) => a + b, 0) +
    reports.rejected.reduce((a, b) => a + b, 0);

  const totalAprobadas = reports.approved.reduce((a, b) => a + b, 0);
  const totalPendientes = reports.pending.reduce((a, b) => a + b, 0);
  const totalRechazadas = reports.rejected.reduce((a, b) => a + b, 0);

  doc.setFontSize(12);
  doc.setFont(undefined, 'normal');
  const paragraph = `Durante el periodo del ${fechaInicio} al ${fechaFin}, se han realizado un total de ${totalCancelaciones} solicitudes de cancelación: ${totalAprobadas} aprobadas, ${totalPendientes} pendientes y ${totalRechazadas} rechazadas. Las cancelaciones se distribuyen en ${reports.subjects.length} asignaturas. Este informe presenta una visualización gráfica de dicha distribución.`;

  // Define ancho máximo del texto según márgenes
  const maxTextWidth = pageWidth - 2 * margin;

  // Divide el texto en líneas ajustadas al ancho permitido
  const lines = doc.splitTextToSize(paragraph, maxTextWidth);

  // Escribir el texto en múltiples líneas (alineado a la izquierda)
  doc.setFontSize(12);
  doc.setFont(undefined, 'normal');
  doc.text(lines, margin, margin + 2 * textMargin);
  // 6. Calcular tamaño disponible para el gráfico (el resto de la página después del texto)
  const chartWidth = 140;   // En milímetros (ajustable)
  const chartHeight = 80;

  // 2. Calcular posición X centrada
  const centerXChart = (pageWidth - chartWidth) / 2;


  //titulo tabla

  const tableTitle = 'Tabla de Cancelaciones Aprobadas';
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  const tableTitleWidth = doc.getTextWidth(tableTitle);
  const tableTitleX = (pageWidth - tableTitleWidth) / 2;
  const tableTitleY = margin + 5 * textMargin - 5; // Un poco antes del inicio de la tabla
  doc.text(tableTitle, tableTitleX, tableTitleY);

  // Ejemplo de datos para la tabla
  const tableHeaders = [['#', 'Asignatura', 'Aprobadas', 'Pendientes', 'Rechazadas', 'Total de cancelaciones']];
  const tableRows = reports.subjects.map((subject, index) => [
    index + 1,
    subject,
    reports.approved[index],
    reports.pending[index],
    reports.rejected[index],
    reports.approved[index] + reports.pending[index] + reports.rejected[index]

  ]);

  autoTable(doc, {
    head: tableHeaders,
    body: tableRows,
    startY: margin + 5 * textMargin,
    margin: { left: margin, right: margin },
    theme: 'striped'
  });


  //tittulo grafica

  const chartTitle = 'Gráfica de Cancelaciones Aprobadas';
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  const chartTitleWidth = doc.getTextWidth(chartTitle);
  const chartTitleX = (pageWidth - chartTitleWidth) / 2;
  const chartTitleY = doc.lastAutoTable.finalY + 19; // Un poco antes de la gráfica
  doc.text(chartTitle, chartTitleX, chartTitleY);

  // 3. Insertar imagen centrada con tamaño reducido
  const chartY = doc.lastAutoTable.finalY + 26;// espacio de 10mm debajo de la tabla
  const remainingSpace = pageHeight - (chartY + chartHeight);
  if (remainingSpace < 0) {
    doc.addPage(); // Agrega nueva página
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text(chartTitle, chartTitleX, margin); // Título en la nueva página
    doc.addImage(imgData, 'PNG', centerXChart, margin + 7, chartWidth, chartHeight);
  } else {
    doc.addImage(imgData, 'PNG', centerXChart, chartY, chartWidth, chartHeight);
  }

  // 8. Crear el blob y la URL para vista previa
  const pdfBlob = doc.output('blob');
  const pdfUrl = URL.createObjectURL(pdfBlob);

  // 9. Pasar el PDF al estado
  setDocumentPdf({ blob: pdfBlob, url: pdfUrl });
  setCanavas({ data: data, options: options });
  // 10. Limpiar el gráfico para liberar memoria
  chart.destroy();
};

export default ReportPdfGeneral;
