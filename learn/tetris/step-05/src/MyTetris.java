import dev.yasuda.tetris.*;

/**
 * Step 5 — 壁と床の衝突判定。
 *
 * 目標: ブロックが盤面の外に飛び出さないようにする。
 *       自動落下は床で止まり、矢印キーも壁を越えない。
 *
 * 学ぶこと:
 *  - boolean を返す小さなヘルパーメソッド（canMove）を書く
 *  - 同じ判定を update と onKey の両方から再利用する
 *  - 境界条件の定番パターン（col < 0, col >= COLS, ...）
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
            if (canMove(blockCol, blockRow + 1)) {
                blockRow++;
            }
        }
    }

    @Override
    public void onKey(Key key) {
        if (key == Key.LEFT  && canMove(blockCol - 1, blockRow)) blockCol--;
        if (key == Key.RIGHT && canMove(blockCol + 1, blockRow)) blockCol++;
        if (key == Key.DOWN  && canMove(blockCol, blockRow + 1)) blockRow++;
    }

    /** (col, row) が盤面の中なら true。 */
    boolean canMove(int col, int row) {
        if (col < 0)     return false;
        if (col >= COLS) return false;
        if (row < 0)     return false;
        if (row >= ROWS) return false;
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
