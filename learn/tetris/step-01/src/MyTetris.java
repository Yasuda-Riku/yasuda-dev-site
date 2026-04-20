import dev.yasuda.tetris.*;

/**
 * Step 1 — Draw the board.
 *
 * Goal: a 10 x 20 grid of empty dark cells.
 * You'll learn: 2D loops, using Screen.fillRect, and constants.
 */
public class MyTetris extends Game {

    static final int COLS = 10;
    static final int ROWS = 20;
    static final int CELL = 24;

    public static void main(String[] args) {
        new MyTetris().run();
    }

    @Override
    public void render(Screen screen) {
        screen.clear(Color.BLACK);

        for (int row = 0; row < ROWS; row++) {
            for (int col = 0; col < COLS; col++) {
                int x = col * CELL;
                int y = row * CELL;
                screen.fillRect(x + 1, y + 1, CELL - 2, CELL - 2, Color.DARK_GRAY);
            }
        }
    }
}
