package decorator;

public class ProcessingFeeDecorator extends PaymentDecorator {

    public ProcessingFeeDecorator(double amount) {
        super(amount);
    }

    @Override
    public double calculate() {
        return amount + amount * 0.05; // phí 5%
    }
}
