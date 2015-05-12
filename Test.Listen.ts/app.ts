/// <reference path="../listen.ts/listen.ts" />

class MyClass {
    value: number;

    @sender
    firstSender(input: boolean) {
        console.log("1");
    }

    @messenger
    secondSender(input: boolean) {
        console.log("2");
    }

    @receiver
    myReciever (input: boolean) {
        console.log(input);
    }
}

function test(input: boolean) {
    console.log("test");
}

var myInstance: MyClass = new MyClass();

Listen.to.sender(myInstance.firstSender).with.receiver(myInstance.myReciever).when(input => input);
Listen.to.sender(myInstance.secondSender).with.receiver(myInstance.myReciever).when(input => input);
Listen.to.sender(myInstance.firstSender).with.function(test);

myInstance.firstSender(true);
myInstance.secondSender(true);