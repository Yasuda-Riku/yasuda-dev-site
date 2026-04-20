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
 * run() drives the game loop itself (inside the JVM). We deliberately
 * do NOT hand control back to JavaScript for per-frame calls: CheerpJ
 * 4.2's JS->Java instance-method bridge triggers WASM "memory access
 * out of bounds" errors in that direction. Java's Thread.sleep yields
 * to the browser event loop transparently under CheerpJ, so a simple
 * while-loop here doesn't freeze the page.
 */
public abstract class Game {

    public void setup() {}

    public void update(double dt) {}

    public abstract void render(Screen screen);

    public void onKey(Key key) {}

    public final void run() {
        setup();
        jsStarted();

        final Screen screen = Screen.INSTANCE;
        long lastNs = System.nanoTime();

        while (true) {
            long now = System.nanoTime();
            double dt = (now - lastNs) / 1_000_000_000.0;
            if (dt > 0.1) dt = 0.1;
            lastNs = now;

            update(dt);
            render(screen);

            // Drain any pending key events from the JS side.
            int k;
            while ((k = jsPollKey()) >= 0) {
                onKey(Key.fromCode(k));
            }

            try {
                Thread.sleep(16);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                return;
            }
        }
    }

    private static native void jsStarted();
    private static native int  jsPollKey();
}
