module viewmodels.states {
    export interface IState {
        enter();

        exit();
    }
}