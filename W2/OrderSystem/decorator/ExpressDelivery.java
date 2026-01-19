package W2.OrderSystem.decorator;

public class ExpressDelivery extends OrderDecorator {
    public ExpressDelivery(OrderService order) {
        super(order);
    }

    @Override
    public double getCost() {
        return order.getCost() + 30;
    }
}
