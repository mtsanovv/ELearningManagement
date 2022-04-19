class CentralTendencyObjectModel {
    constructor(oCentralTendency) {
        this.message = '',
        this.centralTendency = oCentralTendency;
    }

    getMessage() {
        return this.message;
    }

    setMessage(sMessage) {
        this.message = sMessage;
    }

    getCentralTendency() {
        return this.centralTendency;
    }

    setCentralTendency(oCentralTendency) {
        this.centralTendency = oCentralTendency;
    }
}