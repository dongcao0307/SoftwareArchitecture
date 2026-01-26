public class XmlToJsonAdapter implements JsonService {

    private XmlService xmlService;

    public XmlToJsonAdapter(XmlService xmlService) {
        this.xmlService = xmlService;
    }

    @Override
    public String getJsonData() {
        String xml = xmlService.getXmlData();

        // Giả lập chuyển XML -> JSON
        return "{ \"name\": \"Laptop\", \"price\": 1000 }";
    }
}
