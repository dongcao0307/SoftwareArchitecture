package state;

public class NormalState implements ProductState {
    @Override
    public void handle() {
        System.out.println("Sản phẩm đang bán.");
    }
}
