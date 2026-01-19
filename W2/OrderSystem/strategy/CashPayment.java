package W2.OrderSystem.strategy;

public class CashPayment implements PaymentStrategy {
    @Override
    public void pay(double amount) {
        System.out.println("Thanh toán " + amount + " bằng tiền mặt.");
    }
}

