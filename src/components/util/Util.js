export function getDatesSemester() {
    const semester = localStorage.getItem("actualSemester");
    const year = parseInt(semester.split("-")[0]);
    const sem = semester.split("-")[1];

    let startDate, endDate;
    if (sem === "1") {
        startDate = new Date(`${year}-01-01T00:00:00`);
        endDate = new Date(`${year}-06-30T23:59:59`);
    } else if (sem === "2") {
        startDate = new Date(`${year}-07-01T00:00:00`);
        endDate = new Date(`${year}-12-31T23:59:59`);
    }
    return { startDate, endDate };
}