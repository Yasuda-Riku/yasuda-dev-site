import dev.yasuda.tetris.*;
import java.util.Random;

/**
 * Step 9 — 回転。
 *
 * 目標: 上矢印キーで現在のミノを 90 度時計回りに回す。
 *       回した結果が壁・床・既存ブロックにぶつかるときは回転をキャンセル。
 *
 * 学ぶこと:
 *  - 2次元配列を時計回りに回転する式: out[c][n - 1 - r] = in[r][c]
 *  - Shape（形の「種類」）と currentCells（今の向き）を分けて持つ
 *  - 「試して → 検査して → OK なら反映、ダメなら捨てる」パターン
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

    // Shape は「種類」（色を決めるだけ）、currentCells は
    // 今の向きを表すセル配列（プレイヤーが回すたびに差し替わる）。
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

    /** 正方形のセル配列を 90 度時計回りに回して、新しい配列を返す。 */
    static int[][] rotateCW(int[][] cells) {
        int n = cells.length;
        // 行ごとに明示的に確保する。new int[n][n] を繰り返し呼ぶと
        // CheerpJ でまれに行が共有された配列が返る症状があったため。
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
