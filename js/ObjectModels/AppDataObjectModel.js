class AppDataObjectModel {
    constructor(aGrades, aLogs) {
        this.grades = aGrades;
        this.logs = aLogs;
    }

    getLogs() {
        return this.logs;
    }

    getGrades() {
        return this.grades;
    }
}