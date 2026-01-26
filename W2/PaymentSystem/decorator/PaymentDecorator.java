package decorator;

public abstract class PaymentDecorator {
    protected double amount;

    public PaymentDecorator(double amount) {
        this.amount = amount;
    }

    public abstract double calculate();
}
