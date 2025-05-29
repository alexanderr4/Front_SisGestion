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
        // const subjectNameActual = filteredData.length > 0
        //     ? filteredData[0].subject.name
        //     : "";

        const groupSet = new Set();
        const countsByStatus = {
            approved: {},
            pending: {},
            rejected: {}
        };

        filteredData.forEach(item => {
            const groupName = item.subject.name;
            const status = item.status;

            groupSet.add(groupName);

            if (!countsByStatus[status]) return;

            if (!countsByStatus[status][groupName]) {
                countsByStatus[status][groupName] = 0;
            }
            countsByStatus[status][groupName]++;
        });

        const subjects = Array.from(groupSet);
        const approved = subjects.map(grp => countsByStatus.approved[grp] || 0);
        const pending = subjects.map(grp => countsByStatus.pending[grp] || 0);
        const rejected = subjects.map(grp => countsByStatus.rejected[grp] || 0);

        return { subjects, approved, pending, rejected };
    } catch (error) {
        return { subjects: [], approved: [], pending: [], rejected: [] };
    }
}


export default TypeReports;