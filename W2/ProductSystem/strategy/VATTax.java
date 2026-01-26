package strategy;

public class VATTax implements TaxStrategy {
    @Override
    public double calculateTax(double price) {
        return price * 0.1; // 10%
    }
}
