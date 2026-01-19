package decorator;

public class ConsumptionDecorator extends TaxDecorator {

    public ConsumptionDecorator(double price) {
        super(price);
    }

    @Override
    public double calculate() {
        return price * 0.05;
    }
}

