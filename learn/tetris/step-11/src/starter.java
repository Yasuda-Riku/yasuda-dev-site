import dev.yasuda.tetris.*;
import java.util.Random;

/**
 * Step 11 — スコア、ライン数、レベル。
 *
 * 目標: 消したライン数からスコアを計算、10 行ごとにレベルアップ、
 *       レベルが上がるほど落下速度が上がる。右側にサイドパネルを表示。
 *
 * TODO は未定義の識別子です。残したまま Run するとコンパイルエラーになります。
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

    public static void main(String[] args) {
        new MyTetris().run();
    }

    /** 落下間隔（秒）: level が上がるほど短く、最低 0.1 秒。 */
    double dropSeconds() {
        // TODO: level が 1 なら 1.0、2 なら 0.9、3 なら 0.8、... と 0.1 秒ずつ短くする。
        //       式は 1.0 - (level - 1) * 0.1
        double s = 1.0 - (level - TODO) * 0.1;
        return (s < 0.1) ? 0.1 : s;
    }

    @Override
    public void update(double dt) {
        accumulator += dt;
        while (accumulator >= dropSeconds()) {
            accumulator -= dropSeconds();
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
            // 1/2/3/4 行消し → 100/300/500/800 点（× level 倍率）
            int[] points = {0, 100, 300, 500, 800};
            // TODO: level を倍率にかける（score += points[clearedThisTurn] * level;）
            score += points[clearedThisTurn] * TODO;
            // TODO: 10 行ごとにレベルアップ（level = 1 + linesCleared / 10;）
            level = 1 + linesCleared / TODO;
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

        int px = COLS * CELL + 14;
        screen.text(px, 16,  "SCORE", Color.GRAY);
        screen.text(px, 36,  String.valueOf(score), Color.WHITE);
        screen.text(px, 78,  "LEVEL", Color.GRAY);
        screen.text(px, 98,  String.valueOf(level), Color.WHITE);
        screen.text(px, 140, "LINES", Color.GRAY);
        screen.text(px, 160, String.valueOf(linesCleared), Color.WHITE);
    }
}
