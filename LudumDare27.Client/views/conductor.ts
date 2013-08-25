/// <reference path="../viewmodels/conductor.ts" />
/// <reference path="states/istate.ts"/>

module views {

    export class Conductor {

        private stack: states.IState[];

        private conductor: viewmodels.Conductor;

        constructor(conductor: viewmodels.Conductor) {
            this.stack = [];
            this.conductor = conductor;
            this.conductor.pushed.add(this.onPushed);
            this.conductor.popped.add(this.onPopped);
        }

        private onPushed = (viewmodel: viewmodels.states.IState) => {
            var previousView: views.states.IState = this.stack.length > 0 ? this.peek() : null;
            var nextView: views.states.IState = this.createView(viewmodel);
            
            if (previousView != null) {
                console.debug("Exiting " + previousView.id);
            }

            console.debug("Entering " + nextView.id);
            nextView.enter(previousView);
            this.stack.push(nextView);
        }

        private onPopped = () => {
            var popped: states.IState = this.stack.pop();
            var nextState: states.IState = this.peek();
            console.debug("Exiting " + popped.id);
            popped.exit(nextState);
            console.debug("Entering " + nextState.id);
            nextState.enter(popped);
        }

        private createView(viewmodel: viewmodels.states.IState) {
            var viewName: string = viewmodel.id.replace('viewmodels', 'views');

            var modules: string[] = viewName.split('.');
            var viewConstructor: any = window;
            for (var i = 0; i < modules.length; i++) {
                viewConstructor = viewConstructor[modules[i]];
            }

            var view: any = Object.create(viewConstructor.prototype);
            view.constructor.apply(view, [ viewmodel ]);

            return view;
        }

        private peek(): states.IState {
            return this.stack[this.stack.length - 1];
        }
    }

}
