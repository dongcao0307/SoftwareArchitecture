public class Main {
    public static void main(String[] args) {

        Stock appleStock = new Stock();

        Investor a = new Investor("Alice");
        Investor b = new Investor("Bob");

        appleStock.attach(a);
        appleStock.attach(b);

        System.out.println("---- Price Update 1 ----");
        appleStock.setPrice("150 USD");

        System.out.println("---- Price Update 2 ----");
        appleStock.setPrice("170 USD");
    }
}
