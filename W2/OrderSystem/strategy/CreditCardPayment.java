package W2.OrderSystem.strategy;

public class CreditCardPayment implements PaymentStrategy {
    @Override
    public void pay(double amount) {
        System.out.println("Thanh toán " + amount + " bằng thẻ tín dụng.");
    }
}




























}
