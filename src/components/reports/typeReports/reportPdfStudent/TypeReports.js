import { getCancellations } from '../../../../api/Cancellations'

async function TypeReports(fechaInicio, fechaFin, nameStudent) {
    console.log("nombre llega", nameStudent);
    try {
        const inicio = new Date(fechaInicio + 'T00:00:00');
        const fin = new Date(fechaFin + 'T23:59:59');

        const response = await getCancellations();
        const filteredData = response.data.data.filter(item => {
            const fechaCreacion = new Date(item.created_at);
            const nameSearchStudent = item.student?.name?.toLowerCase() || "";
            console.log("nameSearchStudent", nameSearchStudent);
            return (
                fechaCreacion >= inicio &&
                fechaCreacion <= fin &&
                nameSearchStudent.includes(nameStudent.toLowerCase())
            );
        });

        // Obtener el primer subject.name coincidente si existe
        console.log("filteredData por nombre    ", filteredData);
        const studentNameActual = filteredData.length > 0
            ? filteredData[0].student.name
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

        return { group, counts, studentNameActual };
    } catch (error) {
        return { group: [], counts: [], StudentNameActual: "" };
    }
}


export default TypeReports;