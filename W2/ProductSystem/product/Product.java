package product;

import state.ProductState;

public class Product {
    private String name;
    private double price;
    private ProductState state;

    public Product(String name, double price) {
        this.name = name;
        this.price = price;
    }

    public void setState(ProductState state) {
        this.state = state;
    }

    public void showState() {
        state.handle();
    }

    public double getPrice() {
        return price;
    }

    public String getName() {
        return name;
    }
}
