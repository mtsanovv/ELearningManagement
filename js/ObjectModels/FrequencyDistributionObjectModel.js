class FrequencyDistributionObjectModel {
    constructor(oFrequencyDistribution) {
        this.message = '',
        this.frequencyDistribution = oFrequencyDistribution;
    }

    getMessage() {
        return this.message;
    }

    setMessage(sMessage) {
        this.message = sMessage;
    }

    getFrequencyDistribution() {
        return this.frequencyDistribution;
    }

    setFrequencyDistribution(oFrequencyDistribution) {
        this.frequencyDistribution = oFrequencyDistribution;
    }
}