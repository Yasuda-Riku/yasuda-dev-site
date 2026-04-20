import dev.yasuda.tetris.*;

/**
 * Step 3 — 自由落下。
 *
 * 目標: ブロックが 1 秒ごとに 1 マスずつ自動で落下する。
 *       下まで行ったら上に戻ってループする（床判定は Step 5）。
 *
 * 学ぶこと:
 *  - update(double dt) は毎フレーム呼ばれ、dt は経過秒数
 *  - 「累積変数」で時間イベントを正確に刻むパターン
 *  - ロジック（update）と描画（render）の分離
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
            blockRow++;
            if (blockRow >= ROWS) blockRow = 0; // 床まで行ったら上に戻す
        }
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
