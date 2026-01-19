package W2.OrderSystem.state;

public class ProcessingState implements OrderState {
    @Override
    public void handle() {
        System.out.println("Đơn hàng đang được đóng gói và vận chuyển...");
    }
}

