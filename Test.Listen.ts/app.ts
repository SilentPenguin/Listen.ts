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

        this.target.sender(1);
        Assert.that(this.target.value).is.equal.to(1);
        Assert.that(this.target.altValue).is.not.equal.to(1);
    }

    @test
    MessengerConnection(): void {
        Listen.to.sender(this.target.messenger)
            .with.receiver(this.target.receiver);

        this.target.messenger(1);

        Assert.that(this.target.value).is.equal.to(1);
        Assert.that(this.target.altValue).is.equal.to(1);
    }

    @test
    MultiConnection(): void {

        Listen.to.sender(this.target.sender)
            .with.receiver(this.target.receiver);

        Listen.to.sender(this.target.messenger)
            .with.receiver(this.target.receiver);

        this.target.sender(1);

        Assert.that(this.target.value).is.equal.to(1);
        Assert.that(this.target.altValue).is.not.equal.to(1);

        this.target.messenger(2);

        Assert.that(this.target.value).is.equal.to(2);
        Assert.that(this.target.altValue).is.equal.to(2);
    }

    @test
    ChainConnection(): void {

        Listen.to.sender(this.target.sender)
            .with.receiver(this.target.messenger);

        Listen.to.sender(this.target.messenger)
            .with.receiver(this.target.receiver);

        this.target.sender(1);

        Assert.that(this.target.altValue).is.equal.to(1);
        Assert.that(this.target.value).is.equal.to(1);
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