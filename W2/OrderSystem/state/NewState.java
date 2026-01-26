package W2.OrderSystem.state;

public class NewState implements OrderState {
    @Override
    public void handle() {
        System.out.println("Đơn hàng mới được tạo. Kiểm tra thông tin...");
    }
}
