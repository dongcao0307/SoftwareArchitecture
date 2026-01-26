import decorator.*;
import state.*;
import strategy.*;

public class Main {
    public static void main(String[] args) {

        double amount = 1_000_000;

        // STATE
        PaymentState state = new PendingState();
        state.handle();

        // STRATEGY
        PaymentStrategy payment = new CreditCardPayment();

        // DECORATOR
        PaymentDecorator fee = new ProcessingFeeDecorator(amount);
        PaymentDecorator discount = new DiscountDecorator(fee.calculate());

        double finalAmount = discount.calculate();

        payment.pay(finalAmount);

        // Update state
        state = new PaidState();
        state.handle();

        System.out.println("💰 Tổng tiền phải trả: " + finalAmount);
    }
}
