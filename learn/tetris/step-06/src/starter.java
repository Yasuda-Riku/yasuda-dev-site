import dev.yasuda.tetris.*;

/**
 * Step 6 — ブロックの固定と新ブロック生成。
 *
 * 目標: 落ち切ったブロックを盤面に書き込み、新しいブロックを上から出す。
 *
 * 「TODO」は「ここを埋めてください」の仮値です。
 */
public class MyTetris extends Game {

    static final int COLS = 10;
    static final int ROWS = 20;
    static final int CELL = 24;

    static final double DROP_SECONDS = 1.0;

    /** 「ここを書き換えてね」の目印。値としてはただの 0。 */
    static final int TODO = 0;

    // 0 = 空、0 以外 = 固定済みブロック
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
                // 下に行けないので「固定」して新しいブロックを出す
                board[blockRow][blockCol] = TODO;   // ← 1 を入れる（= 埋まっている印）
                blockRow = TODO;                    // ← 上端 0 に戻す
                blockCol = TODO;                    // ← 中央寄りへ（例: COLS / 2 - 1 = 4）
            }
        }
    }

    @Override
    public void onKey(Key key) {
        if (key == Key.LEFT  && canMove(blockCol - 1, blockRow)) blockCol--;
        if (key == Key.RIGHT && canMove(blockCol + 1, blockRow)) blockCol++;
        if (key == Key.DOWN  && canMove(blockCol, blockRow + 1)) blockRow++;
    }

    /** 盤面の中かつ空いていれば true。 */
    boolean canMove(int col, int row) {
        if (col < 0 || col >= COLS) return false;
        if (row < 0 || row >= ROWS) return false;
        // 既に埋まっているセルにも入れない
        if (board[row][col] != TODO) return false;   // ← 0 と比べる
        return true;
    }

    @Override
    public void render(Screen screen) {
        screen.clear(Color.BLACK);

        for (int row = 0; row < ROWS; row++) {
            for (int col = 0; col < COLS; col++) {
                int x = col * CELL;
                int y = row * CELL;
                Color c = (board[row][col] == 0) ? Color.DARK_GRAY : Color.RED;
                screen.fillRect(x + 1, y + 1, CELL - 2, CELL - 2, c);
            }
        }

        int bx = blockCol * CELL;
        int by = blockRow * CELL;
        screen.fillRect(bx + 1, by + 1, CELL - 2, CELL - 2, Color.RED);
    }
}
