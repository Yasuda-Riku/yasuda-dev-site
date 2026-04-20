import dev.yasuda.tetris.*;

/**
 * Step 4 -- Left/right (and down) key input.
 *
 * Goal: arrow keys move the block sideways, and the down arrow
 * nudges it down an extra cell.
 *
 * You'll learn:
 *  - onKey(Key key) fires whenever a tracked key is pressed
 *  - enum comparison with ==
 *  - how logic (onKey) is separate from timing (update)
 *
 * Notice: the block can still fall off the sides of the board. That's
 * on purpose -- Step 5 adds wall collision.
 */
public class MyTetris extends Game {

    static final int COLS = 10;
    static final int ROWS = 20;
    static final int CELL = 24;

    static final double DROP_SECONDS = 1.0;

    int blockCol = 4;
    int blockRow = 0;
    double accumulator = 0.0;

    public static void main(String[] args) {
        new MyTetris().run();
    }

    @Override
    public void update(double dt) {
        accumulator += dt;
        while (accumulator >= DROP_SECONDS) {
            accumulator -= DROP_SECONDS;
            blockRow++;
            if (blockRow >= ROWS) blockRow = 0;
        }
    }

    @Override
    public void onKey(Key key) {
        if (key == Key.LEFT)  blockCol--;
        if (key == Key.RIGHT) blockCol++;
        if (key == Key.DOWN)  blockRow++;
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

        int bx = blockCol * CELL;
        int by = blockRow * CELL;
        screen.fillRect(bx + 1, by + 1, CELL - 2, CELL - 2, Color.RED);
    }
}
