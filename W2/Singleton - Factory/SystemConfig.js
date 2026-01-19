class SystemConfig {
    constructor() {
        if (SystemConfig.instance) {
            return SystemConfig.instance;
        }

        this.tax = 0.1;
        this.serviceFee = 5000;

        SystemConfig.instance = this;
    }

    getTax() {
        return this.tax;
    }

    getServiceFee() {
        return this.serviceFee;
    }
}

module.exports = new SystemConfig();
