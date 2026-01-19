package W2.OrderSystem.decorator;

public class GiftWrap extends OrderDecorator {
    public GiftWrap(OrderService order) {
        super(order);
    }

    @Override
    public double getCost() {
        return order.getCost() + 20;
    }
}
