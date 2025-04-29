import type { IPosition } from "~/game/types/I3D";
import { _Component, ComponentType } from "../_Component";

export enum MoveMode {
    OneWay,
    PingPong,
    Loop,
}

export class MoveBetweenPointsComponent extends _Component {
    readonly pointA: IPosition;
    readonly pointB: IPosition;
    readonly speed: number;
    readonly mode: MoveMode;

    currentDirection: 1 | -1 = 1;

    constructor(
        pointA: IPosition,
        pointB: IPosition,
        speed: number,
        mode: MoveMode = MoveMode.PingPong,
    ) {
        super(ComponentType.Declarative);
        this.pointA = pointA;
        this.pointB = pointB;
        this.speed = speed;
        this.mode = mode;
    }
}
