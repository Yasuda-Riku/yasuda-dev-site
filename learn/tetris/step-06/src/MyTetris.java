import dev.yasuda.tetris.*;

/**
 * Step 6 — ブロックの固定と新ブロック生成。
 *
 * 目標: 落ち切ったブロックを盤面に書き込み（「固定」）、
 *       新しいブロックを上から出す。ブロックが積み上がり始める。
 *
 * 学ぶこと:
 *  - 2次元配列 int[ROWS][COLS] を「盤面の状態」として使う
 *  - 配列への書き込み: board[row][col] = 1
 *  - canMove に「そこが既に埋まっている」チェックを追加
 *  - 落下中のブロックと、固定済みの盤面は別物
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
                // ここで「着地」。盤面に書き込んで、新しいブロックを上から出す。
                board[blockRow][blockCol] = 1;
                blockRow = 0;
                blockCol = COLS / 2 - 1;
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
        if (board[row][col] != 0)   return false;
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
