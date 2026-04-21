package dev.yasuda.othello;

/**
 * Base class for every step. Students extend this and implement
 * render(); update() and onKey() are optional.
 *
 * Typical entry point:
 * <pre>
 *   public static void main(String[] args) {
 *       new MyOthello().run();
 *   }
 * </pre>
 */
public abstract class Game {

    private static Game current;

    public static Game current() {
        return current;
    }

    public static void resetCurrent() {
        current = null;
    }

    public void setup() {}

    public void update(double dt) {}

    public abstract void render(Screen screen);

    public void onKey(Key key) {}

    public final void run() {
        current = this;
        setup();
        render(Screen.INSTANCE);
    }

    public final void tick(int dtMs) {
        double dt = dtMs / 1000.0;
        if (dt > 0.1) dt = 0.1;
        update(dt);
        render(Screen.INSTANCE);
    }

    public final void handleKey(int code) {
        onKey(Key.fromCode(code));
    }
}
