# Listen.ts

Listen.ts is a simple framework for publisher and subscriber handling.

Listen.ts is inspired by the observer pattern implemented in Qt's Signals and Slots. Listen.ts allows a single function call to trigger multiple function calls.

Listen.ts has a similar counterpart, [Respond.ts](https://github.com/SilentPenguin/Respond.ts).
Respond.ts implements chained events, rather than concurrent events.

# What do the handlers look like

Below is a stripped down example containing some of the ideas behind Listen.ts:
  
```typescript
/// <reference path="listen.ts" />

interface IMyClass {
    MySender: (value: number) => void;
}

class MyClass implements IMyClass
{
    @sender
    MySender(value: number) { }
    
    @receiver
    MyReceiver(value: number) {
        console.log(value);
    }
}

var instance: IMyClass = new MyClass();

Listen.to.sender(instance.MySender).with.receiver(instance.MyReceiver);

instance.MySender(2); // console output: 2
```

When a connection is made, any receivers will be called the same value that the sender received.

#Getting Started
Please refer to the [wiki](https://github.com/SilentPenguin/Listen.ts/wiki) for more infomation on working with Listen.ts.
