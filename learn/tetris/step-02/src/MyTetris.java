import dev.yasuda.tetris.*;

/**
 * Step 2 -- Place one block.
 *
 * Goal: keep the empty board from Step 1 AND draw one red cell near the
 * top center. We introduce instance fields to remember "where is the block?"
 * and show how a second fillRect on top of the grid gives you an object.
 */
public class MyTetris extends Game {

    static final int COLS = 10;
    static final int ROWS = 20;
    static final int CELL = 24;

    // Where the block sits on the grid.
    int blockCol = 4;
    int blockRow = 0;

    public static void main(String[] args) {
        new MyTetris().run();
    }

    @Override
    public void render(Screen screen) {
        screen.clear(Color.BLACK);

        // --- Empty board (same as Step 1) ---
        for (int row = 0; row < ROWS; row++) {
            for (int col = 0; col < COLS; col++) {
                int x = col * CELL;
                int y = row * CELL;
                screen.fillRect(x + 1, y + 1, CELL - 2, CELL - 2, Color.DARK_GRAY);
            }
        }

        // --- One block on top ---
        int bx = blockCol * CELL;
        int by = blockRow * CELL;
        screen.fillRect(bx + 1, by + 1, CELL - 2, CELL - 2, Color.RED);
    }
}
