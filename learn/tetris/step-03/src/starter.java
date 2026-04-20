import dev.yasuda.tetris.*;

/**
 * Step 3 — 自由落下。
 *
 * 目標: ブロックが DROP_SECONDS (= 1.0 秒) ごとに 1 マス下がる。
 *       下まで行ったら上に戻ってループする。
 *
 * TODO:
 *   1) accumulator に経過時間 dt を足し込む
 *   2) while の中で blockRow を 1 増やす
 *   3) blockRow が ROWS 以上になったら 0 に戻す
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
        // TODO 1: accumulator に dt を足す
        accumulator += 0;

        // DROP_SECONDS 溜まるたびに中を実行する
        while (accumulator >= DROP_SECONDS) {
            accumulator -= DROP_SECONDS;

            // TODO 2: blockRow を 1 増やす

            // TODO 3: blockRow が ROWS 以上になったら 0 に戻す

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
