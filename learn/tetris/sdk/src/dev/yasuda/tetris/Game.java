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
 */
public abstract class Game {

    public void setup() {}

    public void update(double dt) {}

    public abstract void render(Screen screen);

    public void onKey(Key key) {}

    public final void run() {
        GameLoop.start(this);
    }
}
