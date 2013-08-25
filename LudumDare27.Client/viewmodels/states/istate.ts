/// <reference path="../../models/signals/signal.ts"/>

module viewmodels.states {
    export interface IState {

        id: string;

        stateChanged: Signal;

        enter();

        exit();
    }
}