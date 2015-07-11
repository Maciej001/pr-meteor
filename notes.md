# Notes

1. for portfolio use custom reactive computation: eg. if number of trades in portfolio changes, run update portfolio.
https://www.discovermeteor.com/blog/reactivity-basics-meteors-magic-demystified/

## Tracker (eventedmind)

Computation wraps our function
```
if (Meteor.isClient) {
    sayHello = function sayHello (c) {
        console.log("hello world");
    };

    computation = Tracker.autorun(sayHello);

    c.onInvalidate(function(){
        console.log(c);
        debugger;
    });
}
```

` computation.invalidate()` - reruns `sayHello` function.

If you call `computation.stop()` and then you try calling `.invalidate()` it will return `undefined` and function will not be run.

When computation is run, it is passed as parameter (`c`) to your function. Thanks to that you can implement callback function `c.onIvalidate(...`

### How computations relate to the Call Stack

When program encounters first time `computation = Tracker.autorun(sayHello)` it will immediatelly call our function. 
When function gets called the function is pushed to the Call Stack.

If we didn't get `c` (computation) as parameter we could still access it by 
`computation = Tracker.currentComputation;`
There is only one computation at any given time.

### Tracker flushing
If you .invalidate your computation it doesn't rerun your function right away. It queues the rerun to happen at later time in a process called ** flushing **. 

Queue of computations [c1, c2, ...]. Flush means to go through this array and empty it by rerunning all the computations, so that array empties [...].

When you call invalidate your computation gets added to this queue, but still not executed:

```
if (Meteor.isClient){
    sayHello = function sayHello(){
        console.log('hello world');
    };

    computation = Tracker.autorun(sayHello);

    invalidate = function() { // function to be called in dev tools in browser
        computation.invalidate();
        console.log('called invalidate()');
        // Tracker.flush()
        debugger;
    }
}
```

When you call `invalidate()` in browser, `comuptation.invalidate()` is called, but you will not see 'hello world' printed. First will print 'called invalidate()', as you invalidate was added to the queue to be executed later.
It will be executed on the next 'tick' of the event loop, when the system is idle, or all other functions has been run.

If you were running `invalidate()` several times, it would still execute our function only once, at 'hello world' would be printed only once.

`Tracker.flush()` allows you to flush all the computations, without waiting for another 'tick' of the event loop. 

In the above code without `// Tracker.flush()` we get:
'called invalidate()'
'hello world'

but if we add `Tracker.flush()` we get:
'hello world'
'called invalidate'

Put afterFlush inside your function run by computation
```
Tracker.afterFlush(function(){
    console.log('after flush');
})
```

`afterFlush` can be quite convenient. If you want to run some code immediately after your function has completed. 

`Tracker.active`  - checks if we are inside 

### Tracker.Dependency


## DDP (Distributed Data Protocol)
ddp messages sent between browser and a server via websockets look like regular JSON.

On the first load of the page, http request is sent and ddp.js is loaded. Than we have access in console to `Meteor.connection` object.

DDP Client opens persistent connection over Web Sockets .There is also ddp code running on the server. 

To start 'node inspector', start meteor with:
`meteor --debug-port=8080` - that uses outdated node inspector by meteor

better install: 'npm install -g node-inspector'

in console `NODE_OPTIONS="--debug-brk" meteor` to start application
in console 2 start node inspector `node-inspector`
  



## PUBSUB

Publication function, can take a parameter ('id' below)

```
if (Meteor.isServer) {
    Meteor.publish('items', function(id) {
            console.log('inside publish')
        })
}
```

in console:
`ddp subscribe items`

`Items = new Meteor.Collection` - ???









































