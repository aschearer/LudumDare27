var models;
(function (models) {
    (function (entities) {
        (function (BetType) {
            BetType[BetType["Up"] = 0] = "Up";
            BetType[BetType["Left"] = 1] = "Left";
            BetType[BetType["Down"] = 2] = "Down";
            BetType[BetType["Right"] = 3] = "Right";
        })(entities.BetType || (entities.BetType = {}));
        var BetType = entities.BetType;

        (function (PlayerId) {
            PlayerId[PlayerId["One"] = 0] = "One";
            PlayerId[PlayerId["Two"] = 1] = "Two";
        })(entities.PlayerId || (entities.PlayerId = {}));
        var PlayerId = entities.PlayerId;

        var Player = (function () {
            function Player() {
            }
            Player.prototype.constructor = function (playerId) {
                this.playerId = playerId;
            };
            return Player;
        })();
        entities.Player = Player;

        var Hat = (function () {
            function Hat() {
            }
            Hat.prototype.constructor = function () {
                this.bets = new Array();
                this.lastBetIndex = 0;
            };

            Hat.prototype.AddBet = function (newBet) {
                this.bets.push(newBet);
            };

            Hat.prototype.Shuffle = function () {
                var tempBets = this.bets;
                var totalSlots = tempBets.length;
                this.bets = new Array();

                while (totalSlots > 0) {
                    var item = Math.random() * totalSlots;
                    this.bets.push(tempBets.splice(item, 1)[0]);
                    --totalSlots;
                }
            };

            Hat.prototype.GetNextBet = function () {
                var ret = this.bets[this.lastBetIndex];
                ++this.lastBetIndex;
                return ret;
            };

            Hat.prototype.IsDone = function () {
                return this.lastBetIndex >= this.bets.length;
            };
            return Hat;
        })();
        entities.Hat = Hat;

        var PossibleBets = (function () {
            function PossibleBets() {
            }
            PossibleBets.prototype.constructor = function (betType, available) {
                this.betType = betType;
                this.available = available;
                this.selected = 0;
            };
            return PossibleBets;
        })();
        entities.PossibleBets = PossibleBets;

        var Hand = (function () {
            function Hand() {
            }
            Hand.prototype.constructor = function () {
            };
            return Hand;
        })();
        entities.Hand = Hand;
    })(models.entities || (models.entities = {}));
    var entities = models.entities;
})(models || (models = {}));
//# sourceMappingURL=betting.js.map
