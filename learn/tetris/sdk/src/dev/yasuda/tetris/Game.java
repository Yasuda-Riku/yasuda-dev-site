package dev.yasuda.tetris;

import java.util.Timer;
import java.util.TimerTask;

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
 * run() calls setup(), renders the first frame, signals JS that the
 * game is live, then schedules a 60 fps Timer that drives update +
 * render. main() can then return: the Timer is a non-daemon thread,
 * so the JVM stays alive and the browser main thread stays free.
 */
public abstract class Game {

    private static final int FRAME_MS = 16;

    public void setup() {}

    public void update(double dt) {}

    public abstract void render(Screen screen);

    public void onKey(Key key) {}

    public final void run() {
        setup();
        render(Screen.INSTANCE);
        jsStarted();

        final Game self = this;
        final Screen screen = Screen.INSTANCE;

        Timer timer = new Timer("tetris-game-loop", false);
        timer.scheduleAtFixedRate(new TimerTask() {
            long lastNs = System.nanoTime();

            @Override
            public void run() {
                long now = System.nanoTime();
                double dt = (now - lastNs) / 1_000_000_000.0;
                if (dt > 0.1) dt = 0.1;
                lastNs = now;
                self.update(dt);
                self.render(screen);
            }
        }, FRAME_MS, FRAME_MS);
    }

    private static native void jsStarted();
}
