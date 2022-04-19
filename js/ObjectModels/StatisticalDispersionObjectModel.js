class StatisticalDispersionObjectModel {
    constructor(oStatisticalDispersion) {
        this.message = '',
        this.statisticalDispersion = oStatisticalDispersion;
    }

    getMessage() {
        return this.message;
    }

    setMessage(sMessage) {
        this.message = sMessage;
    }

    getStatisticalDispersion() {
        return this.statisticalDispersion;
    }

    setStatisticalDispersion(oStatisticalDispersion) {
        this.statisticalDispersion = oStatisticalDispersion;
    }
}