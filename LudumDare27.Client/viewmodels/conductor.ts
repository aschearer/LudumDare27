/// <reference path="../models/signals/signal.ts" />
/// <reference path="states/istate.ts"/>

module viewmodels {

    export class Conductor {

        private stack: states.IState[];

        public pushed: Signal;

        public popped: Signal;

        constructor() {
            this.stack = [];
            this.pushed = new Signal();
            this.popped = new Signal();
        }

        public push(viewmodel: states.IState) {
            if (this.stack.length > 0) {
                console.debug("Exiting " + this.peek().id);
                this.peek().stateChanged.remove(this.onStateChanged, this);
                this.peek().exit();
            }

            console.debug("Entering " + viewmodel.id);
            this.stack.push(viewmodel);
            this.peek().stateChanged.add(this.onStateChanged, this);
            this.peek().enter();
            this.pushed.dispatch(viewmodel);
        }

        public pop() {
            if (this.stack.length > 0) {
                console.debug("Exiting " + this.peek().id);
                this.peek().stateChanged.remove(this.onStateChanged, this);
                this.peek().exit();
                var popped: states.IState = this.stack.pop();
                console.debug("Entering " + this.peek().id);
                this.peek().stateChanged.add(this.onStateChanged, this);
                this.peek().enter();

                this.popped.dispatch(popped);
            }
        }

        private peek(): states.IState {
            return this.stack[this.stack.length - 1];
        }

        private onStateChanged(nextViewModel: states.IState) {
            if (nextViewModel == null) {
                this.pop();
            }
            else {
                this.push(nextViewModel);
            }
        }
    }

}
