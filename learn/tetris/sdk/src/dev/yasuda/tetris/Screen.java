package dev.yasuda.tetris;

/**
 * Drawing surface. All drawing happens via this class -- students never
 * touch the HTML canvas directly.
 *
 * A single shared INSTANCE is provided to avoid allocating a new Screen
 * per frame.
 */
public final class Screen {

    public static final Screen INSTANCE = new Screen();

    private Screen() {}

    public void clear(Color c) {
        jsClear(c.r, c.g, c.b);
    }

    public void fillRect(int x, int y, int w, int h, Color c) {
        jsFillRect(x, y, w, h, c.r, c.g, c.b);
    }

    public void strokeRect(int x, int y, int w, int h, Color c) {
        jsStrokeRect(x, y, w, h, c.r, c.g, c.b);
    }

    public void text(int x, int y, String s, Color c) {
        jsText(x, y, s, c.r, c.g, c.b);
    }

    public int width()  { return jsWidth();  }
    public int height() { return jsHeight(); }

    private static native void jsClear(int r, int g, int b);
    private static native void jsFillRect(int x, int y, int w, int h, int r, int g, int b);
    private static native void jsStrokeRect(int x, int y, int w, int h, int r, int g, int b);
    private static native void jsText(int x, int y, String s, int r, int g, int b);
    private static native int  jsWidth();
    private static native int  jsHeight();
}
