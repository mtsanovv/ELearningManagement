class CorrelationAnalysisObjectModel {
    constructor(oCorrelationAnalysis) {
        this.message = '',
        this.correlationAnalysis = oCorrelationAnalysis;
    }

    getMessage() {
        return this.message;
    }

    setMessage(sMessage) {
        this.message = sMessage;
    }

    getCorrelationAnalysis() {
        return this.correlationAnalysis;
    }

    setCorrelationAnalysis(oCorrelationAnalysis) {
        this.correlationAnalysis = oCorrelationAnalysis;
    }
}