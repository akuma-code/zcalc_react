import { InnerCoords } from "../Models/BalkaModel/InterfaceBalkaModels"
import { Point } from "../Models/PointsModel/Point";
import { IPoint } from "../Models/PointsModel/PointInterface";
import { _log } from "../hooks/useUtils";
import { WithPositionProp } from "./LinkedItems"
export type NextConsumeCoordsKeys = keyof Pick<InnerCoords, 'x1' | 'y1'>
export type PrevConsumeCoordsKeys = keyof Pick<InnerCoords, 'x2' | 'y2'>


interface Observer {
    notify(point: IPoint): void;
}
export class ConcreteObserver implements Observer {
    constructor(private name: string) { }

    notify(point: IPoint) {

        _log("observer name: ", this.name, "point is: ", point)
    }
}

interface Subject {
    observers: Observer[];

    addObserver(observer: Observer): void;
    deleteObserver(observer: Observer): void;
    notifyObservers(point: IPoint): void;
}
export class ConcreteSubject implements Subject {
    public observers: Observer[] = [];

    public addObserver(observer: Observer): void {
        this.observers.push(observer);
    }

    public deleteObserver(observer: Observer): void {
        const n: number = this.observers.indexOf(observer);

        n !== -1 && this.observers.splice(n, 1);
    }

    public notifyObservers(point: IPoint): void {
        this.observers.forEach((observer) => observer.notify(point));
    }
}

