/// <reference path="../listen.ts/listen.ts" />
/// <reference path="assert.ts" />
/// <reference path="test.ts" />

class MyClass {
    value: number;
    altValue: number;

    @sender
    sender(input: number) {
        this.altValue = input;
    }

    @messenger
    messenger(input: number) {
        this.altValue = input;
    }

    @receiver
    receiver (input: number) {
        this.value = input;
    }
}

class ListenTests extends Test.Case {
    target: MyClass;

    before(): void {
        this.target = new MyClass();
    }

    @test
    SenderConnection(): void {
        Listen.to.sender(this.target.sender)
            .with.receiver(this.target.receiver);

        this.target.sender(5);
        Assert.that(this.target.value).is.equal.to(5);
    }

    @test
    MessengerConnection(): void {
        Listen.to.sender(this.target.messenger)
            .with.receiver(this.target.receiver);

        this.target.messenger(5);
        Assert.that(this.target.value).is.equal.to(5);
        Assert.that(this.target.altValue).is.equal.to(5);
    }

    @test
    MultiConnection(): void {

        Listen.to.sender(this.target.sender)
            .with.receiver(this.target.receiver);

        Listen.to.sender(this.target.messenger)
            .with.receiver(this.target.receiver);

        this.target.sender(4);
        Assert.that(this.target.value).is.equal.to(4);
        this.target.messenger(5);
        Assert.that(this.target.value).is.equal.to(5);
    }

    @test
    ChainConnection(): void {

        Listen.to.sender(this.target.sender)
            .with.receiver(this.target.messenger);

        Listen.to.sender(this.target.messenger)
            .with.receiver(this.target.receiver);

        this.target.sender(5);
        Assert.that(this.target.altValue).is.equal.to(5);
        Assert.that(this.target.value).is.equal.to(5);
    }
    
}
window.onload = () => {
    var testcase: Test.Case = new ListenTests();
    var element = document.getElementById('content');
    var pass = testcase.run();
    var results = testcase.results();
    var passed = results.filter(item=> item.state == Test.State.pass);
    var failed = results.filter(item=> item.state == Test.State.fail);
    var skipped = results.filter(item=> item.state == Test.State.skip);
    element.innerHTML = (passed ? passed.length + ' tests passed. ' : '')
                      + (failed ? failed.length + ' tests failed. ' : '')
                      + (skipped ? skipped.length + ' tests skipped. ' : '');
};

/*
function test(input: boolean) {
    console.log("test");
}

var myInstance: MyClass = new MyClass();

Listen.to.sender(myInstance.firstSender).with.receiver(myInstance.myReciever).when(input => input);
Listen.to.sender(myInstance.secondSender).with.receiver(myInstance.myReciever).when(input => input);
Listen.to.sender(myInstance.firstSender).with.function(test);

myInstance.firstSender(true);
myInstance.secondSender(true);
*/