package W2.OrderSystem.state;

public class CancelledState implements OrderState {
    @Override
    public void handle() {
        System.out.println("Đơn hàng đã bị hủy và hoàn tiền.");
    }
}
