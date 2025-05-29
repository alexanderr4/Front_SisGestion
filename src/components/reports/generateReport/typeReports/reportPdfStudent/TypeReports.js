import { getCancellations } from '../../../../../api/Cancellations'

async function TypeReports(fechaInicio, fechaFin, nameStudent) {
    try {
        const inicio = new Date(fechaInicio + 'T00:00:00');
        const fin = new Date(fechaFin + 'T23:59:59');

        const response = await getCancellations();
        const filteredData = response.data.data.filter(item => {
            const fechaCreacion = new Date(item.created_at);
            const nameSearchStudent = item.student?.name?.toLowerCase() || "";
            return (
                fechaCreacion >= inicio &&
                fechaCreacion <= fin &&
                nameSearchStudent.includes(nameStudent.toLowerCase())
            );
        });

        // Obtener el primer subject.name coincidente si existe
        // const studentNameActual = filteredData.length > 0
        //     ? filteredData[0].student.name
        //     : "";

        const groupSet = new Set();
        const countsByStatus = {
            approved: {},
            pending: {},
            rejected: {}
        };

        // 4. Clasificar por estado y agrupar por grupo
        filteredData.forEach(item => {
            const groupName = item.student.name;
            const status = item.status;

            groupSet.add(groupName);

            if (!countsByStatus[status]) return; // Ignorar estados no esperados

            if (!countsByStatus[status][groupName]) {
                countsByStatus[status][groupName] = 0;
            }
            countsByStatus[status][groupName]++;
        });

        // 5. Unificar grupos y mapear valores
        const students = Array.from(groupSet);
        const approved = students.map(grp => countsByStatus.approved[grp] || 0);
        const pending = students.map(grp => countsByStatus.pending[grp] || 0);
        const rejected = students.map(grp => countsByStatus.rejected[grp] || 0);

        return { students, approved, pending, rejected };
    } catch (error) {
        return {students: [], approved: [], pending: [], rejected: []};
    }
}


export default TypeReports;