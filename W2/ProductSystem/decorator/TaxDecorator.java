package decorator;

public abstract class TaxDecorator {
    protected double price;

    public TaxDecorator(double price) {
        this.price = price;
    }

    public abstract double calculate();
}
