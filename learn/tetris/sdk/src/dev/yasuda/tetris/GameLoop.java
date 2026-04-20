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

    private GameLoop() {}

    static void start(Game g) {
        game = g;
        if (instance == null) instance = new GameLoop();
        jsRegisterLoop(instance);
        g.setup();
    }

    /** Called by JavaScript each animation frame. */
    public void tick(double dt) {
        if (game == null) return;
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
