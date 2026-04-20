import dev.yasuda.tetris.*;

/**
 * Step 3 -- Free fall.
 *
 * Goal: the block from Step 2 drops one cell every second on its own.
 * When it hits the bottom, wrap back to the top so the animation
 * doesn't stop (Step 5 will introduce a proper floor.)
 *
 * You'll learn:
 *  - update(double dt) is called every frame with the elapsed seconds
 *  - an "accumulator" variable lets you time events precisely
 *  - separating logic (update) from drawing (render)
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
            if (blockRow >= ROWS) blockRow = 0; // loop around for now
        }
    }

    @Override
    public void render(Screen screen) {
        screen.clear(Color.BLACK);

        // Empty board
        for (int row = 0; row < ROWS; row++) {
            for (int col = 0; col < COLS; col++) {
                int x = col * CELL;
                int y = row * CELL;
                screen.fillRect(x + 1, y + 1, CELL - 2, CELL - 2, Color.DARK_GRAY);
            }
        }

        // The block
        int bx = blockCol * CELL;
        int by = blockRow * CELL;
        screen.fillRect(bx + 1, by + 1, CELL - 2, CELL - 2, Color.RED);
    }
}
