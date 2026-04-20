import dev.yasuda.tetris.*;

/**
 * Step 7 -- The seven tetrominoes.
 *
 * Goal: replace the single 1x1 block with the seven classic shapes
 * (I, O, T, S, Z, L, J). They cycle through in order each spawn.
 *
 * You'll learn:
 *  - enum with fields (a Shape carries a Color and a cell pattern)
 *  - multi-cell collision: canMove loops over every filled cell of
 *    the shape, not just one position
 *  - separating "current piece" (shape + position) from the landed
 *    "board" state
 */
public class MyTetris extends Game {

    static final int COLS = 10;
    static final int ROWS = 20;
    static final int CELL = 24;

    static final double DROP_SECONDS = 1.0;

    /** Every tetromino is a color + a grid of 1s and 0s. */
    enum Shape {
        I(Color.CYAN,   new int[][]{
            {0,0,0,0},
            {1,1,1,1},
            {0,0,0,0},
            {0,0,0,0}
        }),
        O(Color.YELLOW, new int[][]{
            {1,1},
            {1,1}
        }),
        T(Color.PURPLE, new int[][]{
            {0,1,0},
            {1,1,1},
            {0,0,0}
        }),
        S(Color.GREEN,  new int[][]{
            {0,1,1},
            {1,1,0},
            {0,0,0}
        }),
        Z(Color.RED,    new int[][]{
            {1,1,0},
            {0,1,1},
            {0,0,0}
        }),
        L(Color.ORANGE, new int[][]{
            {0,0,1},
            {1,1,1},
            {0,0,0}
        }),
        J(Color.BLUE,   new int[][]{
            {1,0,0},
            {1,1,1},
            {0,0,0}
        });

        final Color color;
        final int[][] cells;

        Shape(Color color, int[][] cells) {
            this.color = color;
            this.cells = cells;
        }
    }

    int[][] board = new int[ROWS][COLS];

    // Current falling piece.
    Shape[] bag = Shape.values();
    int bagIndex = 0;
    Shape current = bag[0];
    int pieceCol = 3;
    int pieceRow = 0;

    double accumulator = 0.0;

    public static void main(String[] args) {
        new MyTetris().run();
    }

    @Override
    public void update(double dt) {
        accumulator += dt;
        while (accumulator >= DROP_SECONDS) {
            accumulator -= DROP_SECONDS;
            if (canMove(current, pieceCol, pieceRow + 1)) {
                pieceRow++;
            } else {
                lockPiece();
                spawnNext();
            }
        }
    }

    @Override
    public void onKey(Key key) {
        if (key == Key.LEFT  && canMove(current, pieceCol - 1, pieceRow)) pieceCol--;
        if (key == Key.RIGHT && canMove(current, pieceCol + 1, pieceRow)) pieceCol++;
        if (key == Key.DOWN  && canMove(current, pieceCol, pieceRow + 1)) pieceRow++;
    }

    /** True if placing shape at (col, row) leaves every filled cell inside the board and unoccupied. */
    boolean canMove(Shape shape, int col, int row) {
        int[][] cells = shape.cells;
        for (int r = 0; r < cells.length; r++) {
            for (int c = 0; c < cells[r].length; c++) {
                if (cells[r][c] == 0) continue;
                int bc = col + c;
                int br = row + r;
                if (bc < 0 || bc >= COLS) return false;
                if (br < 0 || br >= ROWS) return false;
                if (board[br][bc] != 0)   return false;
            }
        }
        return true;
    }

    /** Stamp the current piece into the board. */
    void lockPiece() {
        int[][] cells = current.cells;
        for (int r = 0; r < cells.length; r++) {
            for (int c = 0; c < cells[r].length; c++) {
                if (cells[r][c] == 0) continue;
                board[pieceRow + r][pieceCol + c] = 1;
            }
        }
    }

    /** Cycle to the next shape in the bag. */
    void spawnNext() {
        bagIndex = (bagIndex + 1) % bag.length;
        current = bag[bagIndex];
        pieceCol = 3;
        pieceRow = 0;
    }

    @Override
    public void render(Screen screen) {
        screen.clear(Color.BLACK);

        // Board: empty cells dark, landed cells gray.
        for (int row = 0; row < ROWS; row++) {
            for (int col = 0; col < COLS; col++) {
                int x = col * CELL;
                int y = row * CELL;
                Color c = (board[row][col] == 0) ? Color.DARK_GRAY : Color.GRAY;
                screen.fillRect(x + 1, y + 1, CELL - 2, CELL - 2, c);
            }
        }

        // Current piece: each filled cell of its shape, in the shape's color.
        int[][] cells = current.cells;
        for (int r = 0; r < cells.length; r++) {
            for (int c = 0; c < cells[r].length; c++) {
                if (cells[r][c] == 0) continue;
                int x = (pieceCol + c) * CELL;
                int y = (pieceRow + r) * CELL;
                screen.fillRect(x + 1, y + 1, CELL - 2, CELL - 2, current.color);
            }
        }
    }
}
