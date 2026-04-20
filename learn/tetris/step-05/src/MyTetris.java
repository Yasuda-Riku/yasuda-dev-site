import dev.yasuda.tetris.*;

/**
 * Step 5 -- Wall and floor collision.
 *
 * Goal: the block can no longer escape the board. Auto-fall stops at
 * the bottom row; arrow keys are clamped to the left/right edges.
 *
 * You'll learn:
 *  - writing a boolean helper method (canMove) that returns true/false
 *  - reusing the same check from BOTH update() and onKey()
 *  - the classic boundary pattern: col &lt; 0, col &gt;= COLS, etc.
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
            if (canMove(blockCol, blockRow + 1)) {
                blockRow++;
            }
        }
    }

    @Override
    public void onKey(Key key) {
        if (key == Key.LEFT  && canMove(blockCol - 1, blockRow)) blockCol--;
        if (key == Key.RIGHT && canMove(blockCol + 1, blockRow)) blockCol++;
        if (key == Key.DOWN  && canMove(blockCol, blockRow + 1)) blockRow++;
    }

    /** True if (col, row) is inside the board. */
    boolean canMove(int col, int row) {
        if (col < 0)     return false;
        if (col >= COLS) return false;
        if (row < 0)     return false;
        if (row >= ROWS) return false;
        return true;
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
