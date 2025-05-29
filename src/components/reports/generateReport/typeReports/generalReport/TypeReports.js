import { getCancellations } from '../../../../../api/Cancellations';

async function TypeReports(fechaInicio, fechaFin) {
    try {
        const cancellations = await getCancellations().then((response) => {
            const inicio = new Date(fechaInicio + 'T00:00:00');
            const fin = new Date(fechaFin + 'T23:59:59');
            const filteredData = response.data.data.filter(item => {
                const fechaCreacion = new Date(item.created_at);
                return fechaCreacion >= inicio && fechaCreacion <= fin;
            });
            return filteredData;
        }).catch(() => {
            return []
        });

        const subjectsSet = new Set();
        const countsByStatus = {
            approved: {},
            pending: {},
            rejected: {}
        };

        cancellations.forEach(item => {
            const subjectName = item.subject.name;
            const status = item.status;

            subjectsSet.add(subjectName);

            if (!countsByStatus[status]) return; // Ignorar otros estados
            if (!countsByStatus[status][subjectName]) {
                countsByStatus[status][subjectName] = 0;
            }

            countsByStatus[status][subjectName]++;
        });

        const subjects = Array.from(subjectsSet);

        // Asegurar que cada materia tenga un valor, aunque sea 0
        const approved = subjects.map(subj => countsByStatus.approved[subj] || 0);
        const pending = subjects.map(subj => countsByStatus.pending[subj] || 0);
        const rejected = subjects.map(subj => countsByStatus.rejected[subj] || 0);

        return { subjects, approved, pending, rejected };
    } catch (error) {
        return { subjects: [], approved: [], pending: [], rejected: [] };
    }
}

export default TypeReports;
