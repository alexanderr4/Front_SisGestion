import { getCancellations } from '../../../../../api/Cancellations'

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
        }).catch((error) => {
            return []
        });

        const countBySubject = {};

        cancellations.forEach(item => {
            if (item.status === "approved") {
                const subjectName = item.subject.name;
                if (countBySubject[subjectName]) {
                    countBySubject[subjectName]++;
                } else {
                    countBySubject[subjectName] = 1;
                }
            }
        });

    
        const subjects = Object.keys(countBySubject);      // ['Materia A', 'Materia B', ...]
        const counts = Object.values(countBySubject);

        return { subjects, counts };
    } catch (error) {
       return { group: [], counts: []}
    }

}




export default TypeReports;