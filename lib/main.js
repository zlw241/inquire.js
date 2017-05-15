import DOMNodeCollection from './dom_node_collection';

function inquire(selector) {
  let elementArray = [];

  if (selector instanceof Function) {
    const funcArray = [];
    document.addEventListener("DOMContentLoaded", function(event) {
      funcArray.forEach((el) => el());
    });
    funcArray.push(selector);

  } else if (selector instanceof HTMLElement) {
    elementArray = [selector];

  } else {
    let elementList = document.querySelectorAll(selector);
    for (let i = 0; i < elementList.length; i++) {
      elementArray.push(elementList[i]);
    }
  }

  return new DOMNodeCollection(elementArray);
}

inquire.extend = function(...objs) {
  return Object.assign(...objs);
};

inquire.ajax = function(options) {
  let defaults = {
    url: window.location.href,
    method: 'GET',
    dataType: 'JSON',
    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
    async: true,
    global: true,
    headers: {},
    ifModified: false,
    processData: true,
    statusCode: {},
    success: (data) => data,
    error: (error) => error
  };
  let mergedOptions = this.extend(defaults, options);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(mergedOptions.method, mergedOptions.url);
    xhr.onload = function() {
      if (this.status >= 200 && this.status < 300) {
        resolve(JSON.parse(xhr.response));
      } else {
        reject({
          status: this.status,
          statusText: xhr.statusText
        });
      }
    };
    xhr.onerror = function() {
      reject({
        status: this.status,
        statusText: xhr.statusText
      });
    };

    xhr.send(mergedOptions);
  });

};

window.inquire = inquire;

window.testAJAX = () => {
  return inquire.ajax({
    url: 'https://jsonplaceholder.typicode.com/posts',
    method: 'POST',
    data: {
      title: 'foo',
      body: 'bar',
      userId: 1
    }
  })
}
