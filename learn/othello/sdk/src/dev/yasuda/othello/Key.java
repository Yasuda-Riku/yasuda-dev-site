package dev.yasuda.othello;

public enum Key {

    LEFT, RIGHT, UP, DOWN,
    SPACE, ENTER,
    R, P,
    UNKNOWN;

    static Key fromCode(int code) {
        switch (code) {
            case 37: return LEFT;
            case 39: return RIGHT;
            case 38: return UP;
            case 40: return DOWN;
            case 32: return SPACE;
            case 13: return ENTER;
            case 82: return R;
            case 80: return P;
            default: return UNKNOWN;
        }
    }
}
