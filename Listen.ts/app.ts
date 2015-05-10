/// <reference path="listen.ts" />

class MyClass {
    value: number;

    @sender
    firstSender(input: boolean) {
        console.log("1");
        console.log(this.value);
    }

    @sender
    secondSender(input: boolean) {
        console.log("2");
        console.log(this.value);
    }

    @receiver
    myReciever (input: boolean) {
        console.log("3");
        console.log(this.value);
    }

    constructor(value: number) {
        this.value = value;
    }
}