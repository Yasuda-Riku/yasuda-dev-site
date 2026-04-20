import dev.yasuda.tetris.*;
import java.util.Random;

/**
 * Step 12 -- Game over and restart.
 *
 * Goal: when a new piece can't be placed at the spawn position, the
 * game ends. R resets everything and starts a new game.
 *
 * You'll learn:
 *  - detecting "the loss state" with the same canMove() we've had all along
 *  - guarding update/onKey with a gameOver flag so input + falling stop
 *  - bundling reset logic into one method (restart) so "new game" is
 *    one call site, not four or five scattered assignments
 *  - drawing an overlay with Screen.text() on top of the final board
 */
public class MyTetris extends Game {

    static final int COLS = 10;
    static final int ROWS = 20;
    static final int CELL = 24;

    enum Shape {
        I(Color.CYAN,   new int[][]{
            {0,0,0,0}, {1,1,1,1}, {0,0,0,0}, {0,0,0,0}
        }),
        O(Color.YELLOW, new int[][]{
            {1,1}, {1,1}
        }),
        T(Color.PURPLE, new int[][]{
            {0,1,0}, {1,1,1}, {0,0,0}
        }),
        S(Color.GREEN,  new int[][]{
            {0,1,1}, {1,1,0}, {0,0,0}
        }),
        Z(Color.RED,    new int[][]{
            {1,1,0}, {0,1,1}, {0,0,0}
        }),
        L(Color.ORANGE, new int[][]{
            {0,0,1}, {1,1,1}, {0,0,0}
        }),
        J(Color.BLUE,   new int[][]{
            {1,0,0}, {1,1,1}, {0,0,0}
        });

        final Color color;
        final int[][] cells;

        Shape(Color color, int[][] cells) {
            this.color = color;
            this.cells = cells;
        }
    }

    int[][] board = new int[ROWS][COLS];
    Shape[] bag = Shape.values();
    Random rng = new Random();

    Shape currentShape = bag[rng.nextInt(bag.length)];
    int[][] currentCells = currentShape.cells;
    int pieceCol = 3;
    int pieceRow = 0;
    double accumulator = 0.0;

    int score = 0;
    int linesCleared = 0;
    int level = 1;
    boolean gameOver = false;

    public static void main(String[] args) {
        new MyTetris().run();
    }

    double dropSeconds() {
        double s = 1.0 - (level - 1) * 0.1;
        return (s < 0.1) ? 0.1 : s;
    }

    @Override
    public void update(double dt) {
        if (gameOver) return;
        accumulator += dt;
        while (accumulator >= dropSeconds()) {
            accumulator -= dropSeconds();
            if (canMove(currentCells, pieceCol, pieceRow + 1)) {
                pieceRow++;
            } else {
                lockPiece();
                clearLines();
                spawnNext();
                if (gameOver) return;
            }
        }
    }

    @Override
    public void onKey(Key key) {
        if (key == Key.R) {
            restart();
            return;
        }
        if (gameOver) return;
        if (key == Key.LEFT  && canMove(currentCells, pieceCol - 1, pieceRow)) pieceCol--;
        if (key == Key.RIGHT && canMove(currentCells, pieceCol + 1, pieceRow)) pieceCol++;
        if (key == Key.DOWN  && canMove(currentCells, pieceCol, pieceRow + 1)) pieceRow++;
        if (key == Key.UP) {
            int[][] rotated = rotateCW(currentCells);
            if (canMove(rotated, pieceCol, pieceRow)) {
                currentCells = rotated;
            }
        }
    }

    void restart() {
        for (int r = 0; r < ROWS; r++) {
            for (int c = 0; c < COLS; c++) {
                board[r][c] = 0;
            }
        }
        score = 0;
        linesCleared = 0;
        level = 1;
        accumulator = 0.0;
        gameOver = false;
        spawnNext();
    }

    static int[][] rotateCW(int[][] cells) {
        int n = cells.length;
        int[][] out = new int[n][n];
        for (int r = 0; r < n; r++) {
            for (int c = 0; c < n; c++) {
                out[c][n - 1 - r] = cells[r][c];
            }
        }
        return out;
    }

    boolean canMove(int[][] cells, int col, int row) {
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

    void lockPiece() {
        for (int r = 0; r < currentCells.length; r++) {
            for (int c = 0; c < currentCells[r].length; c++) {
                if (currentCells[r][c] == 0) continue;
                board[pieceRow + r][pieceCol + c] = 1;
            }
        }
    }

    void clearLines() {
        int clearedThisTurn = 0;
        int row = ROWS - 1;
        while (row >= 0) {
            if (isRowFull(row)) {
                removeRow(row);
                clearedThisTurn++;
            } else {
                row--;
            }
        }
        if (clearedThisTurn > 0) {
            linesCleared += clearedThisTurn;
            int[] points = {0, 100, 300, 500, 800};
            score += points[clearedThisTurn] * level;
            level = 1 + linesCleared / 10;
        }
    }

    boolean isRowFull(int row) {
        for (int col = 0; col < COLS; col++) {
            if (board[row][col] == 0) return false;
        }
        return true;
    }

    void removeRow(int row) {
        for (int r = row; r > 0; r--) {
            for (int col = 0; col < COLS; col++) {
                board[r][col] = board[r - 1][col];
            }
        }
        for (int col = 0; col < COLS; col++) {
            board[0][col] = 0;
        }
    }

    void spawnNext() {
        currentShape = bag[rng.nextInt(bag.length)];
        currentCells = currentShape.cells;
        pieceCol = 3;
        pieceRow = 0;
        // If the fresh piece can't even be placed: it's over.
        if (!canMove(currentCells, pieceCol, pieceRow)) {
            gameOver = true;
        }
    }

    @Override
    public void render(Screen screen) {
        screen.clear(Color.BLACK);

        for (int row = 0; row < ROWS; row++) {
            for (int col = 0; col < COLS; col++) {
                int x = col * CELL;
                int y = row * CELL;
                Color c = (board[row][col] == 0) ? Color.DARK_GRAY : Color.GRAY;
                screen.fillRect(x + 1, y + 1, CELL - 2, CELL - 2, c);
            }
        }

        if (!gameOver) {
            for (int r = 0; r < currentCells.length; r++) {
                for (int c = 0; c < currentCells[r].length; c++) {
                    if (currentCells[r][c] == 0) continue;
                    int x = (pieceCol + c) * CELL;
                    int y = (pieceRow + r) * CELL;
                    screen.fillRect(x + 1, y + 1, CELL - 2, CELL - 2, currentShape.color);
                }
            }
        }

        int px = COLS * CELL + 14;
        screen.text(px, 16,  "SCORE", Color.GRAY);
        screen.text(px, 36,  String.valueOf(score), Color.WHITE);
        screen.text(px, 78,  "LEVEL", Color.GRAY);
        screen.text(px, 98,  String.valueOf(level), Color.WHITE);
        screen.text(px, 140, "LINES", Color.GRAY);
        screen.text(px, 160, String.valueOf(linesCleared), Color.WHITE);

        if (gameOver) {
            // Dim the playfield
            for (int y = 0; y < ROWS * CELL; y += 2) {
                screen.fillRect(0, y, COLS * CELL, 1, Color.BLACK);
            }
            screen.text(52, 210, "GAME OVER",          Color.RED);
            screen.text(38, 240, "Press R to restart", Color.WHITE);
        }
    }
}
