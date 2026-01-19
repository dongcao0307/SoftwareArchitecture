package state;

public class PaidState implements PaymentState {
    @Override
    public void handle() {
        System.out.println("✅ Thanh toán thành công!");
    }
}
