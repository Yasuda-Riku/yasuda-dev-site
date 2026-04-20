import dev.yasuda.tetris.*;

/**
 * Step 6 -- Lock the block, spawn a new one.
 *
 * Goal: when the block can't fall any further, stamp it into the
 * board and spawn a fresh block at the top. Blocks now actually stack.
 *
 * You'll learn:
 *  - 2D arrays: int[ROWS][COLS] as the board state
 *  - writing to an array cell: board[row][col] = 1
 *  - extending canMove to also reject already-occupied cells
 *  - the falling block vs. the landed board are different things
 */
public class MyTetris extends Game {

    static final int COLS = 10;
    static final int ROWS = 20;
    static final int CELL = 24;

    static final double DROP_SECONDS = 1.0;

    // 0 = empty, non-zero = a landed block.
    int[][] board = new int[ROWS][COLS];

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
            } else {
                // The block has landed: stamp it into the board.
                board[blockRow][blockCol] = 1;
                // Spawn a new block at the top.
                blockRow = 0;
                blockCol = COLS / 2 - 1;
            }
        }
    }

    @Override
    public void onKey(Key key) {
        if (key == Key.LEFT  && canMove(blockCol - 1, blockRow)) blockCol--;
        if (key == Key.RIGHT && canMove(blockCol + 1, blockRow)) blockCol++;
        if (key == Key.DOWN  && canMove(blockCol, blockRow + 1)) blockRow++;
    }

    /** True if (col, row) is inside the board AND not already occupied. */
    boolean canMove(int col, int row) {
        if (col < 0 || col >= COLS) return false;
        if (row < 0 || row >= ROWS) return false;
        if (board[row][col] != 0)   return false;
        return true;
    }

    @Override
    public void render(Screen screen) {
        screen.clear(Color.BLACK);

        // Board: empty cells in DARK_GRAY, landed blocks in RED.
        for (int row = 0; row < ROWS; row++) {
            for (int col = 0; col < COLS; col++) {
                int x = col * CELL;
                int y = row * CELL;
                Color c = (board[row][col] == 0) ? Color.DARK_GRAY : Color.RED;
                screen.fillRect(x + 1, y + 1, CELL - 2, CELL - 2, c);
            }
        }

        // The currently falling block is drawn on top of the board.
        int bx = blockCol * CELL;
        int by = blockRow * CELL;
        screen.fillRect(bx + 1, by + 1, CELL - 2, CELL - 2, Color.RED);
    }
}
