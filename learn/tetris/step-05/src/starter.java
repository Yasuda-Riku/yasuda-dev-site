import dev.yasuda.tetris.*;

/**
 * Step 5 — 壁と床の衝突判定。
 *
 * 目標: ブロックが盤面の外に出ないようにする。
 *
 * TODO は未定義の識別子です。残したまま Run するとコンパイルエラーになります。
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
            // 動けるときだけ下げる
            if (canMove(blockCol, blockRow + TODO)) {   // ← +1 を入れる
                blockRow++;
            }
        }
    }

    @Override
    public void onKey(Key key) {
        if (key == Key.LEFT  && canMove(blockCol + TODO, blockRow)) blockCol--;   // ← -1
        if (key == Key.RIGHT && canMove(blockCol + TODO, blockRow)) blockCol++;   // ← +1
        if (key == Key.DOWN  && canMove(blockCol, blockRow + TODO)) blockRow++;   // ← +1
    }

    /** (col, row) が盤面の中なら true、外なら false。 */
    boolean canMove(int col, int row) {
        // 4 つの境界をチェック。どれかに当たったら「動けない」= false。
        if (col < TODO)    return false;   // ← 0 と比べる
        if (col >= TODO)   return false;   // ← COLS と比べる
        if (row < TODO)    return false;   // ← 0 と比べる
        if (row >= TODO)   return false;   // ← ROWS と比べる
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
