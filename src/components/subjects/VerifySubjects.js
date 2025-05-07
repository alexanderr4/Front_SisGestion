function VerifySubjects(subjectsData, activeTabSubject) {
    const subjects = [
        { code: "8107349", semester: "1", area: "Fundamentación" },
        { code: "8107565", semester: "1", area: "Fundamentación" },
        { code: "8111443", semester: "1", area: "Disciplinar" },
        { code: "8111444", semester: "1", area: "Disciplinar" },
        { code: "8111445", semester: "1", area: "Disciplinar" },
        { code: "8111446", semester: "1", area: "Disciplinar" },
        { code: "8111447", semester: "2", area: "Fundamentación" },
        { code: "8111448", semester: "2", area: "Disciplinar" },
        { code: "8111449", semester: "2", area: "Disciplinar" },
        { code: "8111450", semester: "2", area: "Disciplinar" },
        { code: "8111451", semester: "2", area: "Disciplinar" },
        { code: "8111452", semester: "3", area: "Fundamentación" },
        { code: "8111453", semester: "3", area: "Disciplinar" },
        { code: "8111454", semester: "3", area: "Disciplinar" },
        { code: "8111455", semester: "3", area: "Disciplinar" },
        { code: "8111456", semester: "3", area: "Disciplinar" },
        { code: "8111457", semester: "4", area: "Disciplinar" },
        { code: "8111458", semester: "4", area: "Disciplinar" },
        { code: "8111459", semester: "4", area: "Disciplinar" },
        { code: "8111460", semester: "4", area: "Disciplinar" },
        { code: "8111461", semester: "4", area: "Disciplinar" },
        { code: "8111462", semester: "5", area: "Disciplinar" },
        { code: "8111463", semester: "5", area: "Disciplinar" },
        { code: "8111464", semester: "5", area: "Disciplinar" },
        { code: "8111465", semester: "5", area: "Disciplinar" },
        { code: "8111466", semester: "5", area: "Disciplinar" },
        { code: "8111467", semester: "6", area: "Fundamentación" },
        { code: "8111468", semester: "6", area: "Disciplinar" },
        { code: "8111469", semester: "6", area: "Disciplinar" },
        { code: "8111470", semester: "6", area: "Disciplinar" },
        { code: "8111471", semester: "6", area: "Disciplinar" },
        { code: "8111472", semester: "7", area: "Disciplinar" },
        { code: "8111473", semester: "7", area: "Disciplinar" },
        { code: "8111474", semester: "7", area: "Disciplinar" },
        { code: "8111475", semester: "7", area: "Disciplinar" },
        { code: "8111476", semester: "8", area: "Disciplinar" },
        { code: "8111477", semester: "8", area: "Disciplinar" },
        { code: "8111478", semester: "8", area: "Disciplinar" },
        { code: "8111362", semester: "9", area: "Fundamentación" },
        { code: "8111479", semester: "9", area: "Disciplinar" },
        { code: "8111480", semester: "9", area: "Disciplinar" },
        { code: "8111481", semester: "9", area: "Disciplinar" },
        { code: "8111482", semester: "10", area: "Disciplinar" },
        { code: "8111483", semester: "10", area: "Disciplinar" },
        { code: "8111484", semester: "10", area: "Disciplinar" }
    ]

    try {  
        const merged = subjectsData.map(subject => {
            const schedule = subjects.find(s => s.code === subject.code);
            return {
                ...subject,
                semester: schedule?.semester || "",
                area: schedule?.area || ""
            };
        });
        return merged;
    } catch (error) {
        console.error("Error merging data:", error);
        return ([]);
    }
}

export default VerifySubjects;