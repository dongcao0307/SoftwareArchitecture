import W2.OrderSystem.decorator.BasicOrder;
import W2.OrderSystem.decorator.ExpressDelivery;
import W2.OrderSystem.state.DeliveredState;
import W2.OrderSystem.state.NewState;
import W2.OrderSystem.state.ProcessingState;
import W2.OrderSystem.strategy.CreditCardPayment;
import W2.OrderSystem.strategy.PaymentStrategy;

public class Main {
    public static void main(String[] args) {

        // ===== STATE =====
        Order order = new Order();

        order.setState(new NewState());
        order.process();

        order.setState(new ProcessingState());
        order.process();

        order.setState(new DeliveredState());
        order.process();

        // ===== STRATEGY =====
        PaymentStrategy payment = new CreditCardPayment();
        payment.pay(200);

        // ===== DECORATOR =====
        BasicOrder orderService = new BasicOrder();
        orderService = new ExpressDelivery(orderService);
        orderService = new GiftWrap(orderService);

        System.out.println("Tổng tiền đơn hàng: " + orderService.getCost());
    }
}
