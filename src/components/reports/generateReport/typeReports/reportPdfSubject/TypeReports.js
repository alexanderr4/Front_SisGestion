import { getCancellations } from '../../../../../api/Cancellations'

async function TypeReports(fechaInicio, fechaFin, nameSubject) {
    try {
        const inicio = new Date(fechaInicio + 'T00:00:00');
        const fin = new Date(fechaFin + 'T23:59:59');

        const response = await getCancellations();
        const filteredData = response.data.data.filter(item => {
            const fechaCreacion = new Date(item.created_at);
            const nombreMateria = item.subject?.name?.toLowerCase() || "";
            return (
                fechaCreacion >= inicio &&
                fechaCreacion <= fin &&
                nombreMateria.includes(nameSubject.toLowerCase())
            );
        });

        // Obtener el primer subject.name coincidente si existe
        const subjectNameActual = filteredData.length > 0
            ? filteredData[0].subject.name
            : "";

        const countBySubject = {};
        filteredData.forEach(item => {
            if (item.status === "approved") {
                const groupSubject = item.group;
                countBySubject[groupSubject] = (countBySubject[groupSubject] || 0) + 1;
            }
        });

        const group = Object.keys(countBySubject);
        const counts = Object.values(countBySubject);

        return { group, counts, subjectNameActual };
    } catch (error) {
        return { group: [], counts: [], subjectNameActual: "" };
    }
}


export default TypeReports;