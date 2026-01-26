import java.util.ArrayList;
import java.util.List;

public class Stock implements Subject {

    private List<Observer> observers = new ArrayList<>();
    private String price;

    @Override
    public void attach(Observer o) {
        observers.add(o);
    }

    @Override
    public void detach(Observer o) {
        observers.remove(o);
    }

    public void setPrice(String price) {
        this.price = price;
        notifyObservers();
    }

    @Override
    public void notifyObservers() {
        for (Observer o : observers) {
            o.update("Stock price changed to: " + price);
        }
    }
}
