import { getCancellations } from '../../../../../api/Cancellations';

async function TypeReports(fechaInicio, fechaFin) {
  try {
    const response = await getCancellations();
    const inicio = new Date(fechaInicio + 'T00:00:00');
    const fin = new Date(fechaFin + 'T23:59:59');

    // Filtrar por rango de fechas
    const filteredData = response.data.data.filter(item => {
      const fechaCreacion = new Date(item.created_at);
      return fechaCreacion >= inicio && fechaCreacion <= fin;
    });

    const subjectsSet = new Set();
    const countsByStatus = {
      approved: {},
      pending: {},
      rejected: {}
    };

    filteredData.forEach(item => {
      const subjectName = item?.justification || "Sin motivo"; // Por si no existe subject
      const status = item.status;

      subjectsSet.add(subjectName);

      if (!countsByStatus[status]) return; // Ignorar estados no contemplados

      if (!countsByStatus[status][subjectName]) {
        countsByStatus[status][subjectName] = 0;
      }
      countsByStatus[status][subjectName]++;
    });

    const justification = Array.from(subjectsSet);

    // Mapear a arrays con valores 0 si no existen
    const approved = justification.map(subj => countsByStatus.approved[subj] || 0);
    const pending = justification.map(subj => countsByStatus.pending[subj] || 0);
    const rejected = justification.map(subj => countsByStatus.rejected[subj] || 0);

    return { justification, approved, pending, rejected };

  } catch (error) {
    // En caso de error devolver arrays vacíos
    return { justification: [], approved: [], pending: [], rejected: [] };
  }
}

export default TypeReports;
