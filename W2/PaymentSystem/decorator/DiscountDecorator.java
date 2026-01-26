package decorator;

public class DiscountDecorator extends PaymentDecorator {

    public DiscountDecorator(double amount) {
        super(amount);
    }

    @Override
    public double calculate() {
        return amount - amount * 0.1; // giảm 10%
    }
}
