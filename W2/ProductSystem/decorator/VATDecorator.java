package decorator;

public class VATDecorator extends TaxDecorator {

    public VATDecorator(double price) {
        super(price);
    }

    @Override
    public double calculate() {
        return price * 0.1;
    }
}
