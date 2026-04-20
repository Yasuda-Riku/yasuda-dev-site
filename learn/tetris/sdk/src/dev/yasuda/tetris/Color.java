package dev.yasuda.tetris;

/**
 * RGB color. Has a handful of named constants; more can be built with
 * {@link #rgb(int, int, int)}.
 */
public final class Color {

    public static final Color BLACK     = new Color(  0,   0,   0);
    public static final Color WHITE     = new Color(255, 255, 255);
    public static final Color GRAY      = new Color(128, 128, 128);
    public static final Color DARK_GRAY = new Color( 38,  34,  30);
    public static final Color RED       = new Color(200,  80,  80);
    public static final Color GREEN     = new Color(110, 180, 110);
    public static final Color BLUE      = new Color( 90, 130, 210);
    public static final Color YELLOW    = new Color(215, 186,  90);
    public static final Color ORANGE    = new Color(215, 154,  90);
    public static final Color PURPLE    = new Color(169, 127, 181);
    public static final Color CYAN      = new Color(111, 183, 189);

    public final int r, g, b;

    public Color(int r, int g, int b) {
        this.r = r;
        this.g = g;
        this.b = b;
    }

    public static Color rgb(int r, int g, int b) {
        return new Color(r, g, b);
    }
}
