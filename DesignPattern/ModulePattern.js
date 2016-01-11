// 1. Object Literals  对象字面量
// In object literal notation, an object is described as a set of comma-separated 
// name/value pairs enclosed in curly braces ({}). 

console.log("1. Object Literals  对象字面量");
var myModule = {
 
  myProperty: "someValue",
 
  // object literals can contain properties and methods.
  // e.g we can define a further object for module configuration:
  myConfig: {
    useCaching: true,
    language: "en"
  },
 
  // a very basic method
  saySomething: function () {
    console.log( "myModule.saySomething(): Where in the world is Paul Irish today?" );
  },
 
  // output a value based on the current configuration
  reportMyConfig: function () {
    console.log( "myModule.reportMyConfig(): Caching is: " + ( this.myConfig.useCaching ? "enabled" : "disabled") );
  },
 
  // override the current configuration
  updateMyConfig: function( newConfig ) {
    if ( typeof newConfig === "object" ) {
      this.myConfig = newConfig;
      console.log( "myModule.updateMyConfig - language: " + this.myConfig.language );
    }
  }
    
};
 
// 不需要 new operator， 但是不能用{ ， 因为会引发误会
// Outside of an object, new members may be added to it using assignment as follows 
myModule.newProperty = "newValue";
console.log("myModule.newProperty: " + myModule.newProperty);

// Outputs: Where in the world is Paul Irish today?
myModule.saySomething();
 
// Outputs: Caching is: enabled
myModule.reportMyConfig();
 
// Outputs: fr
myModule.updateMyConfig({
  language: "Frence",
  useCaching: false
});
 
// Outputs: Caching is: disabled
myModule.reportMyConfig();

// 2. Let's begin looking at an implementation of the Module pattern by creating a module which is self-contained.
console.log("2. The Module Pattern: originally defined as a way to provide both private and public encapsulation for classes in conventional software engineering.");
console.log("Let's begin looking at an implementation of the Module pattern by creating a module which is self-contained.");

var testModule = (function(){
    var counter = 0;
    
    return {
        incrementCounter: function(){
            return counter++;
        },
        
        resetCounter: function(){
            console.log("counter value prior to reset: " + counter);
            return counter = 0;
        }
    };
})(); // defination

// Increment our counter
testModule.incrementCounter();
 
// Check the counter value and reset
// Outputs: counter value prior to reset: 1
testModule.resetCounter();

console.log("3. Pablic and prive variables");

// 3. Module Pattern: 第二个例子，包括命名空间、公开和私有的变量
// Here's one that covers namespacing, public and private variables:
var myNamespace = (function () {
 
  var myPrivateVar, myPrivateMethod;
 
  // A private counter variable
  myPrivateVar = 0;
 
  // A private function which logs any arguments
  myPrivateMethod = function( foo ) {
      console.log( "3. Print PRIVATE method: " + foo );
  };
 
  return {
 
    // A public variable
    myPublicVar: "foo",
 
    // A public function utilizing privates
    myPublicFunction: function( bar ) {
 
      // Increment our private counter
      myPrivateVar++;
 
      // Call our private method using bar
      myPrivateMethod( bar );
 
    }
  };
 
})();

myNamespace.myPublicFunction("Message from myPublicFunction!");


var basketModule = (function () {
 
  // privates
  var basket = [];
 
  function doSomethingPrivate() {
    //...
  }
 
  function doSomethingElsePrivate() {
    //...
  }
 
  // Return an object exposed to the public
  return {
    // Add items to our basket
    addItem: function( values ) {   basket.push(values);  },
    // Get the count of items in the basket
    getItemCount: function () {   return basket.length;  },
    // Public alias to a private function
    doSomething: doSomethingPrivate,
    // Get the total value of items in the basket
    getTotal: function () {
      var q = this.getItemCount(), p = 0;
      while (q--) {   p += basket[q].price;  } // 用来连加的超赞的方法
      return p;
    } 
  }; // return object
})();

// 在模块内部，你可能已经注意到，我们返回一个对象。这被自动分配给 basketModule变量，我们就可以与它进行交互，

// basketModule returns an object with a public API we can use
basketModule.addItem({ item: "bread", price: 0.5 });
basketModule.addItem({ item: "butter", price: 0.3 });

console.log( "4. basketModule.getItemCount(): " + basketModule.getItemCount() );  // Outputs: 2
console.log( "basketModule.getTotal(): " + basketModule.getTotal() );// Outputs: 0.8
 
// However, the following will not work:
 
// Outputs: undefined
// This is because the basket itself is not exposed as a part of our public API
console.log( basketModule.basket );
 
// This also won't work as it only exists within the scope of our
// basketModule closure, but not in the returned public object
// console.log( basket );

// 5. Module Pattern Variations: Import mixins
console.log("5. Module Pattern Variations: Import mixins");
// Global module
var myModule = (function ( jQ, _ ) {
 
    function privateMethod1(){
        jQ(".container").html("test");
    }
 
    function privateMethod2(){
      console.log( _.min([10, 5, 100, 2, 1000]) );
    }
 
    return{
        publicMethod: function(){
            privateMethod1();
        }
    };
 
// Pull in jQuery and Underscore
})( jQuery, _ );
 
myModule.publicMethod();

// 6. Module Pattern Variations: Export
// Global module
var myModule = (function () {
 
  // Module object - 用于返回
  var module = {}, privateVariable = "Export: private variable";
 
  function privateMethod() {
    // ...
  }
 
  module.publicProperty = "Foobar";
  module.publicMethod = function () {
    console.log( "6. Module Pattern Variations: Public Method - " + privateVariable );
  };
 
  return module;
})();

myModule.publicMethod();

// 7. Toolkit And Framework-specific Module Pattern Implementations
// Dojo
var store = window.store || {};
 
if ( !store["basket"] ) {  store.basket = {};}
 
if ( !store.basket["core"] ) {  store.basket.core = {};}
 
store.basket.core = { 
    test: function(){  console.log(store.basket.core);  }
    /* ...rest of our logic*/ 
};

// or as follows using Dojo 1.7 (AMD-compatible version) and above:
require(["dojo/_base/customStore"], function( store ){
 
  // using dojo.setObject()
  store.setObject( "basket.core", (function() {
 
      var basket = [];
 
      function privateMethod() {
          console.log(basket);
      }
 
      return {
          publicMethod: function(){
                  privateMethod();
          }
      };
 
  })());
 
});

//  jquery sample
function library( module ) {
 
  $( function() {
    if ( module.init ) {
      module.init();
    }
  });
 
  return module;
}
 
var myLibrary = library(function () {
 
  return {
    init: function () {
      // module implementation
    }
  };
}());
























