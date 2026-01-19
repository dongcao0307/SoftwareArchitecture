const config = require("./SystemConfig");
const TicketFactory = require("./factory/TicketFactory");
const ConcertTicketFactory = require("./factory/ConcertTicketFactory");

// Singleton
console.log("Thuế:", config.getTax());
console.log("Phí dịch vụ:", config.getServiceFee());

// Factory Method
const ticket1 = TicketFactory.createTicket("VIP");
ticket1.showInfo();

// Abstract Factory
const concertFactory = new ConcertTicketFactory();
const ticket2 = concertFactory.createVipTicket();
ticket2.showInfo();
