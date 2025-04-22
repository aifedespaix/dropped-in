export type InputAction =
    | InputMoveAction
    | InputInstantAction
    ;


export type InputMoveAction =
    | "moveForward"
    | "moveBackward"
    | "moveLeft"
    | "moveRight"
    ;

export type InputInstantAction =
    | "jump"
    | "attack"
    ;

