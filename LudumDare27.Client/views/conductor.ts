/// <reference path="../viewmodels/conductor.ts" />
/// <reference path="states/istate.ts"/>

module views {

    export class Conductor {

        stack: states.IState[];

        conductor: viewmodels.Conductor;

        constructor(conductor: viewmodels.Conductor) {
            this.stack = [];
            this.conductor = conductor;
            this.conductor.pushed.add(this.onPushed);
            this.conductor.popped.add(this.onPopped);
        }

        private onPushed = (viewModel: states.IState) => {
            // create view for viewmodel
        }

        private onPopped = () => {
            var popped: states.IState = this.stack.pop();
            var nextState: states.IState = this.stack[this.stack.length - 1];
            popped.exit(nextState);
        }
    }

}
