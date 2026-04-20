import dev.yasuda.tetris.*;

/**
 * Step 6 — ブロックの固定と新ブロック生成。
 *
 * 目標: 落ち切ったブロックを盤面に書き込み、新しいブロックを上から出す。
 *
 * TODO:
 *   1) update() の「下に動けない時」（else 節）に:
 *      - 今の位置を board に書き込む（board[blockRow][blockCol] = 1;）
 *      - blockRow と blockCol を初期位置に戻す（上端・中央）
 *   2) canMove() に「board[row][col] が 0 以外なら動けない」条件を追加
 */
public class MyTetris extends Game {

    static final int COLS = 10;
    static final int ROWS = 20;
    static final int CELL = 24;

    static final double DROP_SECONDS = 1.0;

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
                // TODO 1a: 今の位置を board に書き込む

                // TODO 1b: 新しいブロックを上端・中央から出す
                //          blockRow = 0; blockCol = COLS / 2 - 1;

            }
        }
    }

    @Override
    public void onKey(Key key) {
        if (key == Key.LEFT  && canMove(blockCol - 1, blockRow)) blockCol--;
        if (key == Key.RIGHT && canMove(blockCol + 1, blockRow)) blockCol++;
        if (key == Key.DOWN  && canMove(blockCol, blockRow + 1)) blockRow++;
    }

    /** (col, row) が盤面の中かつ空いていれば true。 */
    boolean canMove(int col, int row) {
        if (col < 0 || col >= COLS) return false;
        if (row < 0 || row >= ROWS) return false;
        // TODO 2: 既に board[row][col] が埋まっていたら false を返す

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
