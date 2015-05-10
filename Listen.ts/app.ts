/// <reference path="listen.ts" />

class MyClass {
    value: number;

    @sender
    firstSender(input: boolean) {
        console.log("1");
    }

    @sender
    secondSender(input: boolean) {
        console.log("2");
    }

    @receiver
    myReciever (input: boolean) {
        console.log("3");
    }
}

var myInstance: MyClass = new MyClass()

Listen.to.sender(myInstance.firstSender).with.receiver(myInstance.myReciever);

myInstance.firstSender(true);