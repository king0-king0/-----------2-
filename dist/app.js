import { HTML_to_json, JSON_to_HTML } from "./HTML_to_json.js";
const m = new HTML_to_json("#container", (data) => {
    if (data) {
        new JSON_to_HTML(data, "#container2");
    }
    else {
        console.error("No data found in m.");
    }
});
