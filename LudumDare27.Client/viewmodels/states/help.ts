module viewmodels.states {
    export class Help implements IState {

        public id: string = "viewmodels.states.Help";

        public stateChanged: Signal = new Signal();

        public enter() {
        }

        public exit() {
        }

        public goBack() {
            this.stateChanged.dispatch(null);
        }
    }
}