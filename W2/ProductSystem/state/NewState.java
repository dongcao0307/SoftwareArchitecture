package state;

public class NewState implements ProductState {
    @Override
    public void handle() {
        System.out.println("Sản phẩm mới tạo.");
    }
}
