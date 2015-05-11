# Listen.ts

Listen.ts is a simple framework for publisher and subscriber handling.

Listen.ts is inspired by the observer pattern implemented in Qt's Signals and Slots. Listen.ts allows a single function call to trigger multiple function calls.

# What do the handlers look like

Below is a stripped down example of the structure used for a test case
  
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

#Getting Started
Please refer to the [wiki](https://github.com/SilentPenguin/Listen.ts/wiki) for more infomation on working with Listen.ts.
