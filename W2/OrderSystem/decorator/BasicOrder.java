package W2.OrderSystem.decorator;

public class BasicOrder implements OrderService {
    @Override
    public double getCost() {
        return 100;
    }
}
