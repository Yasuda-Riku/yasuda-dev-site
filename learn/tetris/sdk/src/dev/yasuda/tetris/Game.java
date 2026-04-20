package dev.yasuda.tetris;

import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import javax.swing.Timer;

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
 * run() does first-frame setup + render, signals JS that the game is
 * live, then starts a Swing Timer. We use javax.swing.Timer (NOT
 * java.util.Timer) because CheerpJ 4.2 implements Swing's event queue
 * on top of browser timers — so actionPerformed fires from JS's event
 * loop without blocking the page. A java.util.Timer thread froze the
 * browser because CheerpJ's Thread.sleep does not actually yield under
 * persistent background work.
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

        Timer timer = new Timer(FRAME_MS, new ActionListener() {
            long lastNs = System.nanoTime();

            @Override
            public void actionPerformed(ActionEvent e) {
                long now = System.nanoTime();
                double dt = (now - lastNs) / 1_000_000_000.0;
                if (dt > 0.1) dt = 0.1;
                lastNs = now;
                self.update(dt);
                self.render(screen);
            }
        });
        timer.start();
    }

    private static native void jsStarted();
}
