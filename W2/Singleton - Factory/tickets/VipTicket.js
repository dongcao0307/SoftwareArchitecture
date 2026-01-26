const Ticket = require("./Ticket");

class VipTicket extends Ticket {
    showInfo() {
        console.log("Vé VIP");
    }
}

module.exports = VipTicket;
