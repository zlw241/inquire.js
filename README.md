# inquire.js

## Overview
inquire.js can be used for making AJAX requests, handling
events, manipulating the DOM, and guaranteeing it works across browsers.

Most of this functionality is implemented using the native DOM API
that is built right in to every browser. For a full list of API methods check
out the the [MDN site][document-apis].

## Goals

+ traverse and manipulate the DOM using vanilla JavaScript
+ create a class to serve as a wrapper for DOM nodes / HTML elements
+ create methods to simplify create and destruction of event listeners.

### Webpack

I use webpack to bundle our files together so that users only have to provide one script tag when linking to inquire.js

### The core function

* In the entry file, inquire will be added to the window as `window.inquire`.
* The function should take one argument.

## Phase 1: DOM Manipulation and Traversal

Create a `DOMNodeCollection` class to hold DOM nodes and offer
convenient methods for traversal and manipulation. I've implemented
`empty`, `remove`, `attr`, `addClass`, `removeClass`, `html`, `find`, `toggleClass`,
`children`, and `parent`, among others that have been added as needed.

#### `inquire(selector)`
* The core function, as we know, receives one argument. If that argument
  is a string, it is expected to be a `CSS` selector that we can use to
  identify nodes in the page.
* Use [this method][querySelectorAll] to get an *array like* object
  (specifically a `NodeList`) that matches the selector using the native
  JavaScript API.
* Once we have our `NodeList` we want to convert it into an actual
  `Array` so we can pass it as an argument to the class we will define
  next.

#### `inquire(HTMLElement)`
* If the argument received is a HTML element, (i.e. an `instanceof`
  `HTMLElement`), its put into an array and returned as an instance of DOMNodeCollection.
* So: the core function can receive either a single HTMLElement or a
  string with a CSS selector and in either case the return value will be a DOMNodeCollection.

#### `DOMNodeCollection`

* Create a file in `/lib` called `dom_node_collection.js`. We'll define our class
here and assign it to `module.exports` in order to use it back in our main file.

* `DOMNodeCollection` should receive an
**array** of [`HTMLElements`][htmlelement] as its only argument. This array is stored as an instance variable.

* All the methods we implementws are applied to every node in the
  internal array.
* The core function returns an instance of DOMNodeCollection.


#### `DOMNodeCollection.prototype` methods
##### `html`
* If it receives an argument, this will become the `innerHTML` of the each of the nodes. If it does **not** receive an
  argument, it returns the `innerHTML` of the **first** node
  in the array.

##### `empty`
* This method clears out the content of all nodes in the internal array. I set the `html` of all nodes to an empty string.

##### `append`
* Take a look [here.][append] This method should accept either a inquire
wrapped collection, an HTML element, or a string. Append the `outerHTML`
of each element in the argument to the `innerHTML` of each element in the
`DOMNodeCollection`.

#### traversal
##### `children`
* `children` is a method that returns a `DOMNodeCollection` of
  **ALL** children of all nodes in the array.
* Each node in the array will natively have a `children` attribute. Look
  [here][children] for more information.
* The return value of this method is an instance of `DOMNodeCollection`.

##### `parent`
* Returns a `DOMNodeCollection` of the `parent`s of each of the nodes

##### `find`
* Returns a `DOMNodeCollection` of all the nodes matching the selector
  passed in as an argument that are descendants of the nodes.
  [This might come in handy][elementqueryselectorall].

##### `remove`
* This `remove`s the html of all the nodes in the array from the DOM
* It should also remove all nodes from the array.

## Event Handling
* These methods should add and remove event handlers, respectively.

* You should find [this resource helpful][addeventlistener] for your `on` method.
Note that this event handler should be registered for every element in the node array!

* TODO: event delegation. Handle cases like:
```javascript
  $("ul").on("click", "li", () => {...})
```

* Users of inquire should only have to provide the event type and not the callback to the
`off` method. In order to do this the `on` method stores the
callback as an attribute on the node so it can later be retrieved by the `off` method.

## Document Ready
```javascript
$( () => alert('the document is ready'));
//$(document).ready(someCallback); would have the same effect
```

The above snippet of code should look quite familiar. Its function is to
pop up a helpful alert when the HTML has finished rendering; when the
`document` is `ready`.

I've added this functionality to the core `inquire` function - the one used to create an instance of
`DOMNodeCollection`.

* If `inquire` receives a function as an argument, it will push
  that function into an array (queue) of functions to be executed when the document is ready.
* Once the document has become ready, all the callbacks are triggered.

## AJAX

### `inquire.ajax`

* `inquire.ajax` should receive one options object argument.  
  * Reference a [sample ajax request][sample-ajax-request] to know what your inputs are and when you expect functions to run.
* Has a `defaults` object. Check [the jQuery `ajax` API document][jquery_ajax]
  that provides defaults for `success`, `error`, `url`, `method`, `data`, `contentType`, and a couple other things.
* User provided `options` are merged onto the `defaults`
* Using the options supplied by the user, make the request.
* `inquire.ajax` returns a promise which are now natively supported in Javascript, so you should use them!

[jquery]: http://api.jquery.com/
[jquery-library]: https://developers.google.com/speed/libraries/#jquery
[document-apis]: https://developer.mozilla.org/en-US/
[append]: http://api.jquery.com/append/
[promise-reading]: ../../readings/promises.md
[promise_doc]: http://www.2ality.com/2014/09/es6-promises-foundations.html
[htmlelement]: https://developer.mozilla.org/en-US/docs/Web/API/element
[children]: https://developer.mozilla.org/en-US/docs/Web/API/ParentNode/children
[elementqueryselectorall]: https://developer.mozilla.org/en-US/docs/Web/API/Element/querySelectorAll
[queryselectorall]: https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll
[addeventlistener]: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
[removeeventlistener]: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener
[sample-ajax-request]: ../../readings/simple-ajax-example.md
[jquery_ajax]: http://api.jquery.com/jquery.ajax/
[vanilla_ajax]: ../../readings/vanilla_ajax.md
