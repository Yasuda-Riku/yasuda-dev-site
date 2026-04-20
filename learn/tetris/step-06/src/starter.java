import dev.yasuda.tetris.*;

/**
 * Step 6 — ブロックの固定と新ブロック生成。
 *
 * 目標: 落ち切ったブロックを盤面に書き込み、新しいブロックを上から出す。
 *
 * TODO:
 *   1) update() の「canMove で下に行けない時」に、
 *        - board[blockRow][blockCol] に 1 を書き込む（= 固定）
 *        - blockRow = 0, blockCol = COLS / 2 - 1 に戻す（= 新規生成）
 *      を追加する。
 *
 *   2) canMove に「board[row][col] が 0 でなければ置けない」チェックを追加する。
 *      これで、既に積まれているブロックの上にも乗るようになる。
 */
public class MyTetris extends Game {

    static final int COLS = 10;
    static final int ROWS = 20;
    static final int CELL = 24;

    static final double DROP_SECONDS = 1.0;

    // 0 = 空、0 以外 = 固定済みブロックあり
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
                // TODO: 固定 → 新規生成

            }
        }
    }

    @Override
    public void onKey(Key key) {
        if (key == Key.LEFT  && canMove(blockCol - 1, blockRow)) blockCol--;
        if (key == Key.RIGHT && canMove(blockCol + 1, blockRow)) blockCol++;
        if (key == Key.DOWN  && canMove(blockCol, blockRow + 1)) blockRow++;
    }

    boolean canMove(int col, int row) {
        if (col < 0 || col >= COLS) return false;
        if (row < 0 || row >= ROWS) return false;
        // TODO: 既に board[row][col] が埋まっていたら false を返す

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
