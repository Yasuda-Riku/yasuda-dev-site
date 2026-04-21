import dev.yasuda.tetris.*;
import java.util.Random;

/**
 * Step 10 — ライン消去。
 *
 * 目標: 横一列がすべて埋まったら消去し、上の行を下にシフト。
 *       複数行一度消し（最大 4 行 = テトリス！）も自動で処理される。
 *
 * 学ぶこと:
 *  - 盤面を下から上へ走査する
 *  - 「ループ中に要素を消す」ときの罠: 消した直後は同じ index を
 *    もう一度チェック（row-- しない）
 *  - その場で行をシフトするときの添え字の持ち方
 */
public class MyTetris extends Game {

    static final int COLS = 10;
    static final int ROWS = 20;
    static final int CELL = 24;
    static final double DROP_SECONDS = 1.0;

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

    public static void main(String[] args) {
        new MyTetris().run();
    }

    @Override
    public void update(double dt) {
        accumulator += dt;
        while (accumulator >= DROP_SECONDS) {
            accumulator -= DROP_SECONDS;
            if (canMove(currentCells, pieceCol, pieceRow + 1)) {
                pieceRow++;
            } else {
                lockPiece();
                clearLines();
                spawnNext();
            }
        }
    }

    @Override
    public void onKey(Key key) {
        if (key == Key.LEFT  && canMove(currentCells, pieceCol - 1, pieceRow)) pieceCol--;
        if (key == Key.RIGHT && canMove(currentCells, pieceCol + 1, pieceRow)) pieceCol++;
        if (key == Key.DOWN  && canMove(currentCells, pieceCol, pieceRow + 1)) pieceRow++;
        if (key == Key.UP) {
            int[][] rotated = rotateCW(currentCells);
            if (!isAllZero(rotated) && canMove(rotated, pieceCol, pieceRow)) {
                currentCells = rotated;
            }
        }
    }

    static int[][] rotateCW(int[][] cells) {
        int n = cells.length;
        int[][] out = new int[n][];
        for (int i = 0; i < n; i++) {
            out[i] = new int[n];
        }
        for (int r = 0; r < n; r++) {
            for (int c = 0; c < n; c++) {
                out[c][n - 1 - r] = cells[r][c];
            }
        }
        return out;
    }

    static boolean isAllZero(int[][] cells) {
        for (int r = 0; r < cells.length; r++) {
            for (int c = 0; c < cells[r].length; c++) {
                if (cells[r][c] != 0) return false;
            }
        }
        return true;
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
                board[pieceRow + r][pieceCol + c] = currentShape.ordinal() + 1;
            }
        }
    }

    /** 埋まっている行を全部消し、上の行を下にシフトする。 */
    void clearLines() {
        int row = ROWS - 1;
        while (row >= 0) {
            if (isRowFull(row)) {
                removeRow(row);
                // row-- しない: シフトで下りてきた行を同じ index で再チェック
            } else {
                row--;
            }
        }
    }

    boolean isRowFull(int row) {
        for (int col = 0; col < COLS; col++) {
            if (board[row][col] == 0) return false;
        }
        return true;
    }

    void removeRow(int row) {
        // row から上の行を 1 つずつ下にずらす
        for (int r = row; r > 0; r--) {
            for (int col = 0; col < COLS; col++) {
                board[r][col] = board[r - 1][col];
            }
        }
        // 一番上の行は空に
        for (int col = 0; col < COLS; col++) {
            board[0][col] = 0;
        }
    }

    void spawnNext() {
        currentShape = bag[rng.nextInt(bag.length)];
        currentCells = currentShape.cells;
        pieceCol = 3;
        pieceRow = 0;
    }

    @Override
    public void render(Screen screen) {
        screen.clear(Color.BLACK);

        for (int row = 0; row < ROWS; row++) {
            for (int col = 0; col < COLS; col++) {
                int x = col * CELL;
                int y = row * CELL;
                int cell = board[row][col];
                Color c = (cell == 0) ? Color.DARK_GRAY : bag[cell - 1].color;
                screen.fillRect(x + 1, y + 1, CELL - 2, CELL - 2, c);
            }
        }

        for (int r = 0; r < currentCells.length; r++) {
            for (int c = 0; c < currentCells[r].length; c++) {
                if (currentCells[r][c] == 0) continue;
                int x = (pieceCol + c) * CELL;
                int y = (pieceRow + r) * CELL;
                screen.fillRect(x + 1, y + 1, CELL - 2, CELL - 2, currentShape.color);
            }
        }
    }
}
