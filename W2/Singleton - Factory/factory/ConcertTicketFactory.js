const EventTicketFactory = require("./EventTicketFactory");
const VipTicket = require("../tickets/VipTicket");
const NormalTicket = require("../tickets/NormalTicket");

class ConcertTicketFactory extends EventTicketFactory {
    createVipTicket() {
        return new VipTicket();
    }

    createNormalTicket() {
        return new NormalTicket();
    }
}

module.exports = ConcertTicketFactory;
