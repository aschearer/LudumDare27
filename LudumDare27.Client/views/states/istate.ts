module views.states {
    export interface IState {

        id: string;

        enter(previousState: IState);

        exit(nextState: IState);
    }
}