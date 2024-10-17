import { HTML_to_json, JSON_to_HTML } from "./HTML_to_json.js";

// إنشاء كائن HTML_to_json
const m = new HTML_to_json("#container", (data) => {
  if (data) {
    // بناء HTML من كائن JSON باستخدام العنصر الجذر
    new JSON_to_HTML(data, "#container2"); // إنشاء الهيكل في وسم <body>
  } else {
    console.error("No data found in m.");
  }
});