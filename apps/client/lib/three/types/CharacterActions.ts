export type CharacterAction = 'forward' | 'backward' | 'left' | 'right' | 'jump'

export interface CharacterActionState {
    forward: boolean
    backward: boolean
    left: boolean
    right: boolean
    jump: boolean
}

export const DEFAULT_ACTION_STATE: CharacterActionState = {
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false
} 