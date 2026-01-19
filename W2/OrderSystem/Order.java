import W2.OrderSystem.state.OrderState;

public class Order {
    private OrderState state;

    public void setState(OrderState state) {
        this.state = state;
    }

    public void process() {
        state.handle();
    }
}
