export class HTML_to_json {
    static getElement(element) {
        return document.querySelector(element);
    }
    static getAttributes(element) {
        const attributesMap = {};
        for (let i = 0; i < element.attributes.length; i++) {
            const attr = element.attributes[i];
            attributesMap[attr.name] = attr.value;
        }
        return attributesMap;
    }
    static getDirectChildrenWithText(parent) {
        const childrenArray = [];
        parent.childNodes.forEach((child) => {
            var _a;
            if (child.nodeType === Node.ELEMENT_NODE) {
                childrenArray.push(child);
            }
            else if (child.nodeType === Node.TEXT_NODE) {
                const trimmedText = (_a = child.textContent) === null || _a === void 0 ? void 0 : _a.trim();
                if (trimmedText) {
                    childrenArray.push(trimmedText);
                }
            }
        });
        return childrenArray;
    }
    static getHTMLElementForm(element) {
        const children = this.getDirectChildrenWithText(element).map((child) => {
            if (typeof child === "string") {
                return child;
            }
            else if (child instanceof HTMLElement) {
                return this.getHTMLElementForm(child);
            }
            return "";
        });
        const attributes = this.getAttributes(element);
        const returntag = {
            tag: element,
            nameOfTag: element.tagName,
            attribute: attributes,
            children: children,
        };
        return returntag;
    }
    constructor(selector, callback) {
        this.data = null;
        const rootElement = HTML_to_json.getElement(selector);
        if (rootElement) {
            this.data = HTML_to_json.getHTMLElementForm(rootElement);
            console.log(this.data);
            callback(this.data);
        }
        else {
            console.error(`Element ${selector} not found`);
            callback(null);
        }
    }
}
export class JSON_to_HTML {
    static createElement(data) {
        const element = document.createElement(data.nameOfTag.toLowerCase());
        for (const [key, value] of Object.entries(data.attribute)) {
            element.setAttribute(key, value);
        }
        data.children.forEach((child) => {
            if (typeof child === "string") {
                element.appendChild(document.createTextNode(child));
            }
            else if (child instanceof Object) {
                const childElement = this.createElement(child);
                element.appendChild(childElement);
            }
        });
        return element;
    }
    constructor(jsonData, containerSelector) {
        const container = document.querySelector(containerSelector);
        if (container) {
            const element = JSON_to_HTML.createElement(jsonData);
            container.appendChild(element);
        }
        else {
            console.error(`Container ${containerSelector} not found`);
        }
    }
}
