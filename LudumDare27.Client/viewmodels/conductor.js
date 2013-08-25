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
        Conductor.prototype.push = function (viewModel) {
            if (this.stack.length > 0) {
                this.stack[this.stack.length - 1].exit();
            }

            this.stack.push(viewModel);
            this.stack[this.stack.length - 1].enter();
            this.pushed.dispatch(viewModel);
        };

        Conductor.prototype.pop = function () {
            if (this.stack.length > 0) {
                this.stack[this.stack.length - 1].exit();
                var popped = this.stack.pop();
                this.pushed.dispatch(popped);
            }
        };
        return Conductor;
    })();
    viewmodels.Conductor = Conductor;
})(viewmodels || (viewmodels = {}));
//# sourceMappingURL=conductor.js.map
