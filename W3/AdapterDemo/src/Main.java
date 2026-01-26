public class Main {
    public static void main(String[] args) {

        XmlService xmlService = new XmlService();

        JsonService adapter = new XmlToJsonAdapter(xmlService);

        System.out.println("JSON Output:");
        System.out.println(adapter.getJsonData());
    }
}
