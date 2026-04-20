package dev.yasuda.tetris;

/**
 * Base class for every step. Students extend this and implement
 * render(); update() and onKey() are optional.
 *
 * Typical entry point:
 * <pre>
 *   public static void main(String[] args) {
 *       new MyTetris().run();
 *   }
 * </pre>
 *
 * The step runtime.js loads this jar via cheerpjRunLibrary (not
 * cheerpjRunMain), invokes MyTetris.main() so the student's own
 * "new MyTetris().run()" fires, and then drives per-frame updates
 * from JavaScript by calling tick() on the instance that run()
 * parked in a static field.
 *
 * This arrangement dodges three CheerpJ 4.2 pain points we hit:
 *  - cheerpjRunMain blocks the browser main thread for the lifetime
 *    of main(), so no in-Java game loop works.
 *  - java.util.Timer / new Thread()+Thread.sleep keeps the JVM alive
 *    but also stalls browser events.
 *  - Swing Timer alone doesn't keep the JVM alive once main returns.
 */
public abstract class Game {

    private static Game current;

    /** Called by JavaScript after cheerpjRunLibrary + main(). */
    public static Game current() {
        return current;
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

    /**
     * JS drives this every animation frame. dt is passed in milliseconds
     * (int) rather than seconds (double) because CheerpJ's JS-to-Java
     * primitive marshaling is flakiest with doubles.
     */
    public final void tick(int dtMs) {
        double dt = dtMs / 1000.0;
        if (dt > 0.1) dt = 0.1;
        update(dt);
        render(Screen.INSTANCE);
    }

    /** JS calls this on keydown. */
    public final void handleKey(int code) {
        onKey(Key.fromCode(code));
    }
}
