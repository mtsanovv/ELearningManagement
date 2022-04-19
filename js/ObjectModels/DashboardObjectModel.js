class DashboardObjectModel {
    constructor(oMiscStats) {
        this.message = '';
        this.miscStats = oMiscStats;
    }

    getMessage() {
        return this.message;
    }
    
    setMessage(sMessage) {
        this.message = sMessage;
    }

    getMiscStats() {
        return this.miscStats;
    }

    setMiscStats(oMiscStats) {
        this.miscStats = oMiscStats;
    }
}