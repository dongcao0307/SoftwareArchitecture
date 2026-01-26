import decorator.*;
import product.Product;
import state.*;

public class Main {
    public static void main(String[] args) {

        Product product = new Product("iPhone 15 Pro", 30000000);

        // State
        product.setState(new LuxuryState());
        product.showState();

        double basePrice = product.getPrice();

        // Decorator (cộng dồn thuế)
        TaxDecorator vat = new VATDecorator(basePrice);
        TaxDecorator consumption = new ConsumptionDecorator(basePrice);
        TaxDecorator luxury = new LuxuryDecorator(basePrice);

        double totalTax = vat.calculate()
                        + consumption.calculate()
                        + luxury.calculate();

        double finalPrice = basePrice + totalTax;

        System.out.println("Giá gốc: " + basePrice);
        System.out.println("Tổng thuế: " + totalTax);
        System.out.println("Giá sau thuế: " + finalPrice);
    }
}
