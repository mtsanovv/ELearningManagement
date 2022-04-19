class FileUploadObjectModel {
    constructor(aGrades, aLogs) {
        this.message = '';
        this.moodleLogsInputValidationFailed = false;
        this.gradesInputValidationFailed = false;
        this.grades = aGrades;
        this.logs = aLogs;
    }

    getLogs() {
        return this.logs;
    }

    getGrades() {
        return this.grades;
    }

    getMessage() {
        return this.message;
    }

    setMessage(sMessage) {
        this.message = sMessage;
    }

    getGradesInputValidationFailed() {
        return this.gradesInputValidationFailed;
    }

    setGradesInputValidationFailed(bValidationFailed) {
        this.gradesInputValidationFailed = bValidationFailed;
    }

    getMoodleLogsInputValidationFailed() {
        return this.moodleLogsInputValidationFailed;
    }

    setMoodleLogsInputValidationFailed(bValidationFailed) {
        this.moodleLogsInputValidationFailed = bValidationFailed;
    }
}