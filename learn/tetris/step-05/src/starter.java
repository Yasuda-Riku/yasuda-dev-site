import dev.yasuda.tetris.*;

/**
 * Step 5 — 壁と床の衝突判定。
 *
 * 目標: ブロックが盤面の外に出ないようにする。
 *
 * TODO:
 *   1) canMove() の中で 4 つの境界条件をチェックする
 *      - col が 0 未満なら false
 *      - col が COLS 以上なら false
 *      - row が 0 未満なら false
 *      - row が ROWS 以上なら false
 *   2) update / onKey の動きを「canMove が true のときだけ動く」に書き換える
 */
public class MyTetris extends Game {

    static final int COLS = 10;
    static final int ROWS = 20;
    static final int CELL = 24;

    static final double DROP_SECONDS = 1.0;

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
            // TODO 2a: 「canMove(blockCol, blockRow + 1) が true なら blockRow++」に書き換える
            blockRow++;
            if (blockRow >= ROWS) blockRow = 0;
        }
    }

    @Override
    public void onKey(Key key) {
        // TODO 2b: 各行の && で canMove をチェックしてから動かす
        //   例: if (key == Key.LEFT && canMove(blockCol - 1, blockRow)) blockCol--;
        if (key == Key.LEFT)  blockCol--;
        if (key == Key.RIGHT) blockCol++;
        if (key == Key.DOWN)  blockRow++;
    }

    /** (col, row) が盤面の中なら true。 */
    boolean canMove(int col, int row) {
        // TODO 1: 4 つの境界をチェックする（どれかに当てはまったら false を返す）

        return true;
    }

    @Override
    public void render(Screen screen) {
        screen.clear(Color.BLACK);

        for (int row = 0; row < ROWS; row++) {
            for (int col = 0; col < COLS; col++) {
                int x = col * CELL;
                int y = row * CELL;
                screen.fillRect(x + 1, y + 1, CELL - 2, CELL - 2, Color.DARK_GRAY);
            }
        }

        int bx = blockCol * CELL;
        int by = blockRow * CELL;
        screen.fillRect(bx + 1, by + 1, CELL - 2, CELL - 2, Color.RED);
    }
}
