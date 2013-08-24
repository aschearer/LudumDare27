/// <reference path="../../models/simulations/simulation.ts" />
/// <reference path="../../libs/typings/easeljs/easeljs.d.ts" />

module views.simulations {
    export class Simulation {

        private datacontext: models.simulations.Simulation;
        private stage: createjs.Stage;

        constructor(canvas: HTMLCanvasElement, datacontext: models.simulations.Simulation) {
            this.datacontext = datacontext;
            this.stage = new createjs.Stage(canvas);
        }

        activate() {
            createjs.Ticker.addEventListener('tick', this.onTick);
        }

        deactivate() {
            createjs.Ticker.removeEventListener('tick', this.onTick);
        }

        private onTick = (tickEvent: createjs.TickerEvent) => {
            this.datacontext.update(tickEvent.delta);
        }
    }
}
