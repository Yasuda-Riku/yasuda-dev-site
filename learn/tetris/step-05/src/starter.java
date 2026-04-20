import dev.yasuda.tetris.*;

/**
 * Step 5 — 壁と床の衝突判定。
 *
 * 目標: ブロックが盤面の外に出ないようにする。
 *
 * TODO:
 *   1) canMove(int col, int row) を実装してください。
 *      col < 0、col >= COLS、row < 0、row >= ROWS のどれかなら false を返す。
 *      それ以外なら true。
 *
 *   2) update と onKey の中で、動かす前に canMove をチェックしてから動かすように書き換える。
 *      例: if (canMove(blockCol - 1, blockRow)) blockCol--;
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
            // TODO: canMove(blockCol, blockRow + 1) が true のときだけ blockRow++
            blockRow++;
            if (blockRow >= ROWS) blockRow = 0;
        }
    }

    @Override
    public void onKey(Key key) {
        // TODO: 各キーで動かす前に canMove で行ける先をチェックする
        if (key == Key.LEFT)  blockCol--;
        if (key == Key.RIGHT) blockCol++;
        if (key == Key.DOWN)  blockRow++;
    }

    // TODO: boolean canMove(int col, int row) を実装する
    //       盤面の外なら false、中なら true


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
