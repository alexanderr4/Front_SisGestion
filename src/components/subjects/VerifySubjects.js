function VerifySubjects(subjectsData, activeTabSubject) {
    const subjects = [
        { code: "8107349", area: "Fundamentación" },
        { code: "8107565", area: "Fundamentación" },
        { code: "8111443", area: "Disciplinar" },
        { code: "8111444", area: "Disciplinar" },
        { code: "8111445", area: "Disciplinar" },
        { code: "8111446", area: "Disciplinar" },
        { code: "8111447", area: "Fundamentación" },
        { code: "8111448", area: "Disciplinar" },
        { code: "8111449", area: "Disciplinar" },
        { code: "8111450", area: "Disciplinar" },
        { code: "8111451", area: "Disciplinar" },
        { code: "8111452", area: "Fundamentación" },
        { code: "8111453", area: "Disciplinar" },
        { code: "8111454", area: "Disciplinar" },
        { code: "8111455", area: "Disciplinar" },
        { code: "8111456", area: "Disciplinar" },
        { code: "8111457", area: "Disciplinar" },
        { code: "8111458", area: "Disciplinar" },
        { code: "8111459", area: "Disciplinar" },
        { code: "8111460", area: "Disciplinar" },
        { code: "8111461", area: "Disciplinar" },
        { code: "8111462", area: "Disciplinar" },
        { code: "8111463", area: "Disciplinar" },
        { code: "8111464", area: "Disciplinar" },
        { code: "8111465", area: "Disciplinar" },
        { code: "8111466", area: "Disciplinar" },
        { code: "8111467", area: "Fundamentación" },
        { code: "8111468", area: "Disciplinar" },
        { code: "8111469", area: "Disciplinar" },
        { code: "8111470", area: "Disciplinar" },
        { code: "8111471", area: "Disciplinar" },
        { code: "8111472", area: "Disciplinar" },
        { code: "8111473", area: "Disciplinar" },
        { code: "8111474", area: "Disciplinar" },
        { code: "8111475", area: "Disciplinar" },
        { code: "8111476", area: "Disciplinar" },
        { code: "8111477", area: "Disciplinar" },
        { code: "8111478", area: "Disciplinar" },
        { code: "8111362", area: "Fundamentación" },
        { code: "8111479", area: "Disciplinar" },
        { code: "8111480", area: "Disciplinar" },
        { code: "8111481", area: "Disciplinar" },
        { code: "8111482", area: "Disciplinar" },
        { code: "8111483", area: "Disciplinar" },
        { code: "8111484", area: "Disciplinar" },
        { code: "8111646", area: "Disciplinar y Profundización" },
        { code: "8111641", area: "Disciplinar y Profundización" },
        { code: "8111642", area: "Disciplinar y Profundización" },
        { code: "8111643", area: "Disciplinar y Profundización" },
        { code: "8111644", area: "Disciplinar y Profundización" },
        { code: "8111645", area: "Disciplinar y Profundización" },
        { code: "8111647", area: "Disciplinar y Profundización" },
        { code: "8111648", area: "Disciplinar y Profundización" },
        { code: "8111649", area: "Disciplinar y Profundización" }
    ];


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