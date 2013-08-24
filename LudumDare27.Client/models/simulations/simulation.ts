/// <reference path="../entities/ientity.ts"/>

module models.simulations {

    export class Simulation {

        private entities: models.entities.IEntity[];

        public entityAdded: Signal;
        public entityRemoved: Signal;

        public update(elapsedTime: number) {
        }

        public Add(entity: models.entities.IEntity) {
            this.entities[entity.id] = entity;
            this.entityAdded.dispatch(entity);
        }

        public Remove(entity: models.entities.IEntity) {
            if (entity.id in this.entities) {
                delete this.entities[entity.id];
            }
        }
    }
}
