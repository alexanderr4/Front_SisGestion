import { getCancellations } from '../../../../../api/Cancellations'

async function TypeReports(fechaInicio, fechaFin, reason) {
    try {
        const inicio = new Date(fechaInicio + 'T00:00:00');
        const fin = new Date(fechaFin + 'T23:59:59');

        const response = await getCancellations();
        const filteredData = response.data.data.filter(item => {
            const fechaCreacion = new Date(item.created_at);
            return (
                fechaCreacion >= inicio &&
                fechaCreacion <= fin
            );
        });

        // Obtener el primer subject.name coincidente si existe
        const reasonNameActual = filteredData.length > 0
            ? filteredData[0].justification
            : "";

        const countBySubject = {};
        filteredData.forEach(item => {
            if (item.status === "approved") {
                const groupSubject = item.justification;
                countBySubject[groupSubject] = (countBySubject[groupSubject] || 0) + 1;
            }
        });

        const justification = Object.keys(countBySubject);
        const counts = Object.values(countBySubject);

        return { justification, counts };
    } catch (error) {
        return { group: [], counts: [] };
    }
}


export default TypeReports;