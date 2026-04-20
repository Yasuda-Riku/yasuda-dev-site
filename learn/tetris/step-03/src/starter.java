import dev.yasuda.tetris.*;

/**
 * Step 3 — 自由落下。
 *
 * 目標: ブロックが DROP_SECONDS (= 1.0 秒) ごとに 1 マス下がる。
 *       下まで行ったら上に戻ってループする。
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

    int blockCol = 4;
    int blockRow = 0;
    double accumulator = 0.0;

    public static void main(String[] args) {
        new MyTetris().run();
    }

    @Override
    public void update(double dt) {
        // 経過時間を accumulator に貯める
        accumulator += TODO;   // ← dt を足す

        // DROP_SECONDS 溜まるたびに 1 マス落とす
        while (accumulator >= DROP_SECONDS) {
            accumulator -= DROP_SECONDS;

            blockRow += TODO;  // ← 1 を足す

            // 下端まで行ったら上端に戻す
            if (blockRow >= ROWS) {
                blockRow = TODO;  // ← 0 に戻す
            }
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
