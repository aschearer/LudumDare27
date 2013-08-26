/// <reference path="istate.ts"/>
/// <reference path="../../viewmodels/states/help.ts"/>

module views.states {
    export class Help implements IState {

        public id: string = "views.states.Help";

        public layer: HTMLElement;

        private datacontext: viewmodels.states.Help;
        private instructions: HTMLUListElement;
        private activeInstruction: HTMLElement;
        public currentInstruction: number = -1;
        private activeButton: HTMLAnchorElement;

        constructor(datacontext: viewmodels.states.Help) {
            this.datacontext = datacontext;
            this.layer = document.getElementById('help-layer');
            this.instructions = <HTMLUListElement>this.layer.getElementsByClassName('instructions')[0];
        }

        public enter(previousState: IState) {
            this.currentInstruction = 0;
            this.activateInstruction(this.currentInstruction);
        }

        public exit(nextState: IState) {
            if (this.activeButton) {
                this.activeButton.onclick = null;
            }
        }

        private activateInstruction(activeInstruction: number) {
            if ((this.activeInstruction != null) && this.activeInstruction.classList.contains('active-instruction')) {
                this.activeInstruction.classList.remove('active-instruction');
            }
            if (this.activeButton) {
                this.activeButton.onclick = null;
            }

            if (activeInstruction >= this.instructions.children.length) {
                this.datacontext.goBack();
            } else {
                this.activeInstruction = <HTMLElement>this.instructions.children[activeInstruction];
                this.activeInstruction.classList.add('active-instruction');
                this.activeButton = <HTMLAnchorElement>this.activeInstruction.getElementsByClassName('more-button')[0];
                this.activeButton.onclick = () => {
                    this.activateInstruction(activeInstruction + 1);
                };
            }
        }
    }
}