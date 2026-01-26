package W2.OrderSystem.state;

public class DeliveredState implements OrderState {
    @Override
    public void handle() {
        System.out.println("Đơn hàng đã được giao thành công.");
    }
}

