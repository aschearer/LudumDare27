var views;
(function (views) {
    /// <reference path="istate.ts"/>
    /// <reference path="../../viewmodels/states/help.ts"/>
    (function (states) {
        var Help = (function () {
            function Help(datacontext) {
                this.id = "views.states.Help";
                this.currentInstruction = -1;
                this.datacontext = datacontext;
                this.layer = document.getElementById('help-layer');
                this.instructions = this.layer.getElementsByClassName('instructions')[0];
            }
            Help.prototype.enter = function (previousState) {
                this.currentInstruction = 0;
                this.activateInstruction(this.currentInstruction);
            };

            Help.prototype.exit = function (nextState) {
                if (this.activeButton) {
                    this.activeButton.onclick = null;
                }
            };

            Help.prototype.activateInstruction = function (activeInstruction) {
                var _this = this;
                if ((this.activeInstruction != null) && this.activeInstruction.classList.contains('active-instruction')) {
                    this.activeInstruction.classList.remove('active-instruction');
                }
                if (this.activeButton) {
                    this.activeButton.onclick = null;
                }

                if (activeInstruction >= this.instructions.children.length) {
                    this.datacontext.goBack();
                } else {
                    this.activeInstruction = this.instructions.children[activeInstruction];
                    this.activeInstruction.classList.add('active-instruction');
                    this.activeButton = this.activeInstruction.getElementsByClassName('more-button')[0];
                    this.activeButton.onclick = function () {
                        _this.activateInstruction(activeInstruction + 1);
                        return false;
                    };
                }
            };
            return Help;
        })();
        states.Help = Help;
    })(views.states || (views.states = {}));
    var states = views.states;
})(views || (views = {}));
//# sourceMappingURL=help.js.map
