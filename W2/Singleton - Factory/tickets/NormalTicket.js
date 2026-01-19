const Ticket = require("./Ticket");

class NormalTicket extends Ticket {
    showInfo() {
        console.log("Vé thường");
    }
}

module.exports = NormalTicket;
