class DOMNodeCollection {
  constructor(htmlElements) {
    this.htmlElements = htmlElements;
  }

  html(htmlString) {
    if (htmlString !== undefined) {
      this.each((el) => {
        el.innerHTML = htmlString;
      });
      return this.htmlElements;
    }
    return this.htmlElements[0].innerHTML;
  }

  empty() {
    this.html('');
  }

  each(callback) {
    this.htmlElements.forEach((el) => {
      callback(el);
    });
    return this.htmlElements;
  }

  append(argument) {
    if (argument instanceof DOMNodeCollection) {
      argument.each((arg) => {
        this.each((el) => {
          el.innerHTML += arg.outerHTML;
        });
      });
    } else {
      this.each((el) => {
        el.innerHTML += argument.outerHTML;
      });
    }
  }

  attr(attrName, attrValue) {
    if (attrValue === undefined) {
      return this.htmlElements[0].getAttribute(attrName);
    } else {
      return this.each((el) => {
        el.setAttribute(attrName, attrValue);
      });
    }
  }

  removeAttr(attrName) {
    this.each((el) => {
      el.removeAttribute(attrName)
    })
  }

  addClass(...classNames) {
    this.each((el) => {
      el.classList.add(...classNames);
    });
  }

  removeClass(...className) {
    this.each((el) => {
      el.classList.remove(...className);
      if (el.classList.length === 0) {
        el.removeAttribute('class');
      }
    });
  }

  toggleClass(...className) {
    this.each((el) => {
      if (el.classList.contains(className)) {
        el.classList.remove(className);
      } else {
        el.classList.add(className);
      }
    });
  }

  children() {
    let array = [];
    this.each((el) => {
      if (el.children.length === 0) {
        return new DOMNodeCollection(el);
      } else {
        for (let i = 0; i < el.children.length; i++) {
          array.push(el.children[i]);
        }
      }
    });

    return new DOMNodeCollection(array);
  }

  parent() {
    let parents = [];
    this.each((el) => {
      parents.push(el.parentElement);
    });

    return new DOMNodeCollection(parents);
  }

  find(selector) {
    let array = [];
    this.each((el) => {
      let found = el.querySelectorAll(selector);
      for (let i = 0; i < found.length; i++) {
        array.push(found[i]);
      }
    });
    return new DOMNodeCollection(array);
  }

  remove() {
    this.each((el) => {
      el.remove();
    });
    this.htmlElements = [];
  }

  on(domEvent, callback) {
    this.each((el) => {
      el.addEventListener(domEvent, callback);
      const eventKey = `callback-${domEvent}`;
      if (typeof el[eventKey] === "undefined") {
        el[eventKey] = [];
      }
      el[eventKey].push(callback);
    });
  }

  off(domEvent) {
    this.each((el) => {
      const eventKey = `callback-${domEvent}`;
      if (el[eventKey]) {
        el[eventKey].forEach((callback) => {
          el.removeEventListener(domEvent, callback)
        });
      }
      el[eventKey] = [];
    });
  }

  css(propertyName, value) {
    if (typeof value === "undefined") {
      return this.htmlElements[0].style[propertyName]
    } else {
      this.each((el) => {
        el.style[propertyName] = value
      })
    }
  }
}


export default DOMNodeCollection;
