/// <reference path="../models/signals/signal.ts" />
/// <reference path="states/istate.ts"/>
var viewmodels;
(function (viewmodels) {
    var Conductor = (function () {
        function Conductor() {
            this.stack = [];
            this.pushed = new Signal();
            this.popped = new Signal();
        }
        Conductor.prototype.push = function (viewmodel) {
            if (this.stack.length > 0) {
                console.debug("Exiting " + this.peek().id);
                this.peek().stateChanged.remove(this.onStateChanged, this);
                this.peek().exit();
            }

            console.debug("Entering " + viewmodel.id);
            this.stack.push(viewmodel);
            this.peek().stateChanged.add(this.onStateChanged, this);
            this.peek().enter();
            this.pushed.dispatch(viewmodel);
        };

        Conductor.prototype.pop = function () {
            if (this.stack.length > 0) {
                console.debug("Exiting " + this.peek().id);
                this.peek().stateChanged.remove(this.onStateChanged, this);
                this.peek().exit();
                var popped = this.stack.pop();
                console.debug("Entering " + this.peek().id);
                this.peek().stateChanged.add(this.onStateChanged, this);
                this.peek().enter();

                this.popped.dispatch(popped);
            }
        };

        Conductor.prototype.peek = function () {
            return this.stack[this.stack.length - 1];
        };

        Conductor.prototype.onStateChanged = function (nextViewModel) {
            if (nextViewModel == null) {
                this.pop();
            } else {
                this.push(nextViewModel);
            }
        };
        return Conductor;
    })();
    viewmodels.Conductor = Conductor;
})(viewmodels || (viewmodels = {}));
//# sourceMappingURL=conductor.js.map
