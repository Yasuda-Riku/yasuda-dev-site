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
        render(Screen.INSTANCE);
        jsStarted();
        // For Step 1 we only need a single render pass — the board is
        // a static image, and CheerpJ 4.2 blocks the browser main thread
        // for the entire lifetime of cheerpjRunMain. Later steps that
        // need animation will drive the loop via java.util.Timer (runs
        // on a JVM thread that CheerpJ schedules cooperatively).
    }

    private static native void jsStarted();
}
