interface tagHTML {
  tag: HTMLElement;
  nameOfTag: string;
  attribute: object;
  children: (tagHTML | string)[];
}
export class HTML_to_json {
  public data: tagHTML | null = null;
  // استرجاع عنصر HTML باستخدام querySelector
  static getElement(element: string): HTMLElement | null {
    return document.querySelector(element);
  }

  // استرجاع جميع السمات ككائن
  static getAttributes(element: HTMLElement): object {
    const attributesMap: { [key: string]: string } = {};
    for (let i = 0; i < element.attributes.length; i++) {
      const attr = element.attributes[i];
      attributesMap[attr.name] = attr.value;
    }
    return attributesMap;
  }

  // استرجاع جميع العناصر الفرعية والنصوص
  static getDirectChildrenWithText(
    parent: HTMLElement
  ): (HTMLElement | string)[] {
    const childrenArray: (HTMLElement | string)[] = [];
    parent.childNodes.forEach((child) => {
      if (child.nodeType === Node.ELEMENT_NODE) {
        childrenArray.push(child as HTMLElement);
      } else if (child.nodeType === Node.TEXT_NODE) {
        const trimmedText = child.textContent?.trim();
        if (trimmedText) {
          childrenArray.push(trimmedText);
        }
      }
    });
    return childrenArray;
  }

  // تحويل عنصر HTML إلى كائن JSON
  static getHTMLElementForm(element: HTMLElement): tagHTML {
    const children = this.getDirectChildrenWithText(element).map((child) => {
      if (typeof child === "string") {
        return child;
      } else if (child instanceof HTMLElement) {
        return this.getHTMLElementForm(child); // استدعاء تكراري للعناصر الفرعية
      }
      return ""; // للتعامل مع الحالات الغير متوقعة
    });

    const attributes = this.getAttributes(element);

    const returntag: tagHTML = {
      tag: element, // تخزين العنصر الفعلي
      nameOfTag: element.tagName,
      attribute: attributes,
      children: children,
    };

    return returntag;
  }

  // المُنشئ (constructor)
  constructor(selector: string, callback: (data: tagHTML | null) => void) {
    const rootElement = HTML_to_json.getElement(selector);
    if (rootElement) {
      this.data = HTML_to_json.getHTMLElementForm(rootElement); // تخزين البيانات في الخاصية data
      console.log(this.data);
      callback(this.data); // استدعاء callback بعد تخزين البيانات
    } else {
      console.error(`Element ${selector} not found`);
      callback(null); // استدعاء callback مع null إذا لم يتم العثور على العنصر
    }
  }
}










export class JSON_to_HTML {
  // تحويل كائن JSON إلى عنصر HTML
  static createElement(data: tagHTML): HTMLElement {
    // إنشاء عنصر جديد باستخدام اسم الوسم
    const element = document.createElement(data.nameOfTag.toLowerCase());

    // إضافة السمات
    for (const [key, value] of Object.entries(data.attribute)) {
      element.setAttribute(key, value);
    }

    // إضافة الأطفال
    data.children.forEach((child) => {
      if (typeof child === "string") {
        // إذا كان الطفل نصًا، قم بإضافته كنص
        element.appendChild(document.createTextNode(child));
      } else if (child instanceof Object) {
        // إذا كان الطفل كائنًا، قم بإنشاء عنصر HTML من الكائن
        const childElement = this.createElement(child);
        element.appendChild(childElement);
      }
    });

    return element;
  }

  // المُنشئ (constructor)
  constructor(jsonData: tagHTML, containerSelector: string) {
    const container = document.querySelector(containerSelector);
    if (container) {
      const element = JSON_to_HTML.createElement(jsonData);
      container.appendChild(element); // إضافة العنصر الجديد إلى الحاوية
    } else {
      console.error(`Container ${containerSelector} not found`);
    }
  }
}

