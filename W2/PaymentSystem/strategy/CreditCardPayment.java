package strategy;

public class CreditCardPayment implements PaymentStrategy {
    @Override
    public void pay(double amount) {
        System.out.println("💳 Thanh toán bằng THẺ TÍN DỤNG: " + amount);
    }
}
