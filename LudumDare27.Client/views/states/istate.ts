module views.states {
    export interface IState {

        id: string;

        layer: HTMLElement;

        enter(previousState: IState);

        exit(nextState: IState);
    }
}