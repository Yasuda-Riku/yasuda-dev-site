package dev.yasuda.tetris;

/**
 * Bridges the Java-side Game with the JavaScript animation loop.
 * Students should never need to look at this file.
 *
 * Implementation note: we expose tick()/onKey() as INSTANCE methods and hand
 * the instance to JS. CheerpJ's Java↔JS interop is most reliable through
 * object handles.
 */
public final class GameLoop {

    private static GameLoop instance;
    private static Game game;
    private static final Screen SHARED_SCREEN = new Screen();

    private long lastNanos = 0L;

    private GameLoop() {}

    static void start(Game g) {
        game = g;
        if (instance == null) instance = new GameLoop();
        jsRegisterLoop(instance);
        g.setup();
    }

    /**
     * Called by JavaScript each animation frame. No args — we measure dt
     * internally to keep the JS-side call shape as simple as possible.
     * (CheerpJ primitive-typed overload resolution has been flaky.)
     */
    public void tick() {
        if (game == null) return;
        long now = System.nanoTime();
        double dt = (lastNanos == 0L) ? 0.0 : (now - lastNanos) / 1_000_000_000.0;
        if (dt > 0.1) dt = 0.1; // cap spikes (tab switched, etc.)
        lastNanos = now;
        game.update(dt);
        game.render(SHARED_SCREEN);
    }

    /** Called by JavaScript on keydown. */
    public void onKey(int code) {
        if (game == null) return;
        game.onKey(Key.fromCode(code));
    }

    private static native void jsRegisterLoop(GameLoop instance);
}
