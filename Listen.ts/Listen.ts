module Listen {
    /*----------------*
     *   Decorators   *
     *----------------*/

    function MessengerDecorator(): ISenderDecorator {
        return <T extends Function>(target: Object, key: string, descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> => {
            descriptor = { get: MessengerConstructor(key, descriptor.value) };
            return descriptor;
        };
    }

    function MessengerConstructor<T extends Function>(key: string, func: T): any {
        return function (): IMessenger<T> {
            var value = function (...rest: any[]) {
                var result = func.apply(this, rest);
                this[key].targets.forEach(item => item.trigger.apply(item, rest));
                return result;
            }.bind(this);

            Object.defineProperty(this, key, { value: value });

            this[key].targets = this[key].targets || [];
            this[key].sources = this[key].sources || [];

            return this[key];
        }
    }

    function SenderDecorator(): ISenderDecorator {
        return <T extends Function>(target: Object, key: string, descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> => {
            descriptor = { get: SenderConstructor(key, descriptor.value) };
            return descriptor;
        };
    }

    function SenderConstructor<T extends Function>(key: string, func: T): any {
        return function (): ISender<T> {
            var value = function (...rest: any[]) {
                this[key].targets.forEach(item => item.trigger.apply(item, rest));
            }.bind(this);

            Object.defineProperty(this, key, { value: value });

            this[key].targets = this[key].targets || [];

            return this[key];
        }
    }

    function ReceiverDecorator(): IReceiverDecorator {
        return <T extends Function>(target: Object, key: string, descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> => {
            descriptor = { get: ReceiverConstructor(key, descriptor.value) };
            return descriptor;
        };
    }

    function ReceiverConstructor<T extends Function>(key: string, func: T): any {
        return function (): IReceiver<T> {
            var value = function (...rest: any[]) {
                return func.apply(this, rest);
            }.bind(this);

            Object.defineProperty(this, key, { value: value });

            this[key].sources = this[key].sources || [];

            return this[key];
        }
    }

    export var messenger: IMessengerDecorator = MessengerDecorator();
    export var sender: ISenderDecorator = SenderDecorator();
    export var receiver: IReceiverDecorator = ReceiverDecorator();

    /*----------------*
     * Implementation *
     *----------------*/

    class Connection<T extends Function> implements IConnection<T> {
        sender: ISender<T>;
        receiver: IReceiver<T>;
        condition: (...rest: any[]) => boolean;

        constructor(sender: T, receiver: T){
            this.sender = <any>sender;
            this.receiver = <any>receiver;
            this.sender.targets.push(this);
            this.receiver.sources.push(this);
        }

        trigger(...rest: any[]): void {
            if (this.condition == null || this.condition.apply(null, rest)) {
                this.receiver.apply(null, rest);
            }
        }

        when(condition: T) {
            this.condition = <any>condition;
        }
    }
    
    /*----------------*
     *    Queries     *
     *----------------*/

    export var to: ITo = {
        sender: ToSender()
    };

    function ToSender(): IToSender {
        return <T extends Function>(sender: T): ISenderQuery<T> => {
            return new SenderQuery(sender);
        }
    }

    class SenderQuery<T extends Function> implements ISenderQuery<T> {
        sender: ISender<T>;
        with: IWith<T> = With.call(this);
        withhold: IWithhold<T> = Withhold.call(this);
        constructor(sender: T) {
            this.sender = <any>sender;
        }
    }

    function With<T extends Function>(): IWith<T> {
        return {
            sender: (sender: T): IConnection<T> => {
                var result: IConnection<T> = new Connection(this.sender, sender);
                return result;
            },
            receiver: (receiver: T): IConnection<T> => {
                var result: IConnection<T> = new Connection(this.sender, receiver);
                return result;
            }
        }
    }

    function Withhold<T extends Function>(): IWithhold<T> {
        return {
            sender: (sender: T): void => {
                var result: Connection<T> = new Connection(this.sender, sender);
            },
            receiver: (receiver: T): void => {
                var result: Connection<T> = new Connection<T>(this.sender, receiver);
            }
        }
    }

    /*----------------*
     *   Interfaces   *
     *----------------*/

    //Decorator Interfaces

    interface IMethodDecorator<> {
        (target: Object, key: string, descriptor: TypedPropertyDescriptor<any>): TypedPropertyDescriptor<any>;
    }

    interface IReceiverDecorator extends IMethodDecorator { }

    interface ISenderDecorator extends IMethodDecorator { }

    interface IMessengerDecorator extends IMethodDecorator { }

    //Implementation Interfaces

    interface IReceiver<T extends Function> extends Function {
        sources: IConnection<T>[];
    }

    interface ISender<T extends Function> extends IReceiver<T> {
        targets: IConnection<T>[];
    }

    interface IMessenger<T extends Function> extends ISender<T>, IReceiver<T> { }

    interface IConnection<T extends Function> {
        sender: ISender<T>;
        receiver: IReceiver<T>;
        trigger: (...rest:any[]) => void;
        when: IWhen<T>;
    }

    interface ITo {
        sender: IToSender;
    }

    interface IToSender {
        <T extends Function>(sender: T): ISenderQuery<T>
    }

    interface ISenderQuery <T extends Function> {
        with: IWith<T>;
        withhold: IWithhold<T>;
    }

    interface IWith<T extends Function> {
        sender: (sender: T) => IConnection<T>;
        receiver: (sender: T) => IConnection<T>;
    }

    interface IWithhold<T extends Function> {
        sender: (sender: T) => void;
        receiver: (sender: T) => void;
    }

    interface IWhen<T> {
        (condition: T): void;
    }
}

var messenger = Listen.messenger;
var sender = Listen.sender;
var receiver = Listen.receiver;