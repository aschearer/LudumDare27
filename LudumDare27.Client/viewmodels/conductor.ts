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

        public push(viewModel: states.IState) {
            if (this.stack.length > 0) {
                this.stack[this.stack.length - 1].exit();
            }

            this.stack.push(viewModel);
            this.stack[this.stack.length - 1].enter();
            this.pushed.dispatch(viewModel);
        }

        public pop() {
            if (this.stack.length > 0) {
                this.stack[this.stack.length - 1].exit();
                var popped: states.IState = this.stack.pop();
                this.pushed.dispatch(popped);
            }
        }
    }

}
