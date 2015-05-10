/// <reference path="listen.ts" />

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

var myInstance: MyClass = new MyClass();

Listen.to.sender(myInstance.firstSender).with.receiver(myInstance.myReciever).when(input => input);
Listen.to.sender(myInstance.secondSender).with.receiver(myInstance.myReciever).when(input => input);

myInstance.firstSender(true);
myInstance.secondSender(true);