package decorator;

public class LuxuryDecorator extends TaxDecorator {

    public LuxuryDecorator(double price) {
        super(price);
    }

    @Override
    public double calculate() {
        return price * 0.2;
    }
}
