import dev.yasuda.tetris.*;

/**
 * Step 7 — 7 種類のミノ。
 *
 * 目標: 1 セルのブロックを、I, O, T, S, Z, L, J のテトロミノに置き換える。
 *       とりあえず順番にループ出現する（ランダムは Step 8）。
 *
 * 学ぶこと:
 *  - フィールドを持つ enum（Shape に色と セル配列を持たせる）
 *  - 複数セルの衝突判定: canMove が shape の全セルをループ
 *  - 「現在のピース（形 + 位置）」と「固定盤面」の分離
 */
public class MyTetris extends Game {

    static final int COLS = 10;
    static final int ROWS = 20;
    static final int CELL = 24;

    static final double DROP_SECONDS = 1.0;

    /** 各ミノは「色」と「1/0 のセル配列」を持つ。 */
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

    // 現在の落下ピース
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

    /** shape を (col, row) に置いたとき、全セルが盤面の中かつ空なら true。 */
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

    /** 現在のピースを盤面に固定する（= 書き込む）。 */
    void lockPiece() {
        int[][] cells = current.cells;
        for (int r = 0; r < cells.length; r++) {
            for (int c = 0; c < cells[r].length; c++) {
                if (cells[r][c] == 0) continue;
                board[pieceRow + r][pieceCol + c] = current.ordinal() + 1;
            }
        }
    }

    /** 次のミノへ（bag を順に回す）。 */
    void spawnNext() {
        bagIndex = (bagIndex + 1) % bag.length;
        current = bag[bagIndex];
        pieceCol = 3;
        pieceRow = 0;
    }

    @Override
    public void render(Screen screen) {
        screen.clear(Color.BLACK);

        // 盤面: 空セルは暗いグレー、固定済みはそのミノの色
        for (int row = 0; row < ROWS; row++) {
            for (int col = 0; col < COLS; col++) {
                int x = col * CELL;
                int y = row * CELL;
                int cell = board[row][col];
                Color c = (cell == 0) ? Color.DARK_GRAY : bag[cell - 1].color;
                screen.fillRect(x + 1, y + 1, CELL - 2, CELL - 2, c);
            }
        }

        // 現在のピース: 埋まっているセルだけを current.color で描く
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
