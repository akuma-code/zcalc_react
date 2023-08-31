import { ChainList, ChainNode } from "../../CommonFns/LinkedItems";
import { AnchorPoint, CreatePoints, Point } from "./Point";

type IAnchorData = {
    pt: AnchorPoint
    counter: number
}

export class ChainPointsList<T extends IAnchorData> extends ChainList<T>{

}

export function initAnchors(points: Point[]) {
    let counter = 1
    return points.reduce((list, p) => {
        const apoint = new AnchorPoint(p.x, p.y)
        if (!list) list = new ChainPointsList()
        const data = {
            pt: apoint,
            counter: counter
        }

        list.push(data)
        counter++

        return list
    }, {} as ChainPointsList<IAnchorData>)

}