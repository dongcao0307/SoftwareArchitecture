package state;

public class LuxuryState implements ProductState {
    @Override
    public void handle() {
        System.out.println("Sản phẩm cao cấp (xa xỉ).");
    }
}
