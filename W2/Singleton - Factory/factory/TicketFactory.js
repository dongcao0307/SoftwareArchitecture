const NormalTicket = require("../tickets/NormalTicket");
const VipTicket = require("../tickets/VipTicket");

class TicketFactory {
    static createTicket(type) {
        switch (type) {
            case "VIP":
                return new VipTicket();
            case "NORMAL":
                return new NormalTicket();
            default:
                throw new Error("Loại vé không hợp lệ");
        }
    }
}

module.exports = TicketFactory;
