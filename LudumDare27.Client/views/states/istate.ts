module views.states {
    export interface IState {
        enter(previousState: IState);

        exit(nextState: IState);
    }
}