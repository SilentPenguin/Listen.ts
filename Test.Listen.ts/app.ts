/// <reference path="../listen.ts/listen.ts" />
/// <reference path="../../test.ts/test.ts/assert.ts" />
/// <reference path="../../test.ts/test.ts/test.ts" />

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

        Assert.that(this.target.value).is.undefined();
        Assert.that(this.target.altValue).is.undefined();
    }

    @test
    SenderConnection(): void {
        Listen.to.sender(this.target.sender).with.receiver(this.target.receiver);

        this.target.sender(1);

        Assert.that(this.target.value).is.equal.to(1);
        Assert.that(this.target.altValue).is.undefined();
    }

    @test
    SenderDisconnection(): void {
        Listen.to.sender(this.target.sender).with.receiver(this.target.receiver);
        this.target.sender(1);

        Assert.that(this.target.value).is.equal.to(1);

        Listen.to.sender(this.target.sender).withhold.receiver(this.target.receiver);
        this.target.sender(2);

        Assert.that(this.target.value).is.not.equal.to(2);
    }

    @test
    MessengerConnection(): void {
        Listen.to.sender(this.target.messenger).with.receiver(this.target.receiver);

        this.target.messenger(1);

        Assert.that(this.target.value).is.equal.to(1);
        Assert.that(this.target.altValue).is.equal.to(1);
    }

    @test
    MultiConnection(): void {

        Listen.to.sender(this.target.sender).with.receiver(this.target.receiver);
        Listen.to.sender(this.target.messenger).with.receiver(this.target.receiver);

        this.target.sender(1);

        Assert.that(this.target.value).is.equal.to(1);
        Assert.that(this.target.altValue).is.undefined();

        this.target.messenger(2);

        Assert.that(this.target.value).is.equal.to(2);
        Assert.that(this.target.altValue).is.equal.to(2);
    }

    @test
    ChainConnection(): void {

        Listen.to.sender(this.target.sender).with.receiver(this.target.messenger);

        Listen.to.sender(this.target.messenger).with.receiver(this.target.receiver);

        this.target.sender(1);

        Assert.that(this.target.altValue).is.equal.to(1);
        Assert.that(this.target.value).is.equal.to(1);
    }

    @test
    When(): void {

        Listen.to.sender(this.target.sender).with.receiver(this.target.messenger).when(input => input == 1);

        this.target.sender(1);

        Assert.that(this.target.altValue).is.equal.to(1);
        Assert.that(this.target.value).is.not.equal.to(1);
    }
}

window.onload = () => {
    document.getElementById('content').innerHTML = new Report.Html(new ListenTests).run();
}