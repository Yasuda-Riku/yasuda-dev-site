import dev.yasuda.tetris.*;

/**
 * Step 4 — 左右キーと下キーの操作。
 *
 * 目標: 矢印キーでブロックを左右に動かす、下矢印で 1 マス加速して落とす。
 *
 * TODO は未定義の識別子です。残したまま Run するとコンパイルエラーになります。
 * 1 マス分の変化量は +1 か -1。
 *
 * 注意: 今は壁判定がないので、画面外に出ていきます（Step 5 で直します）。
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
            if (blockRow >= ROWS) blockRow = 0;
        }
    }

    @Override
    public void onKey(Key key) {
        if (key == Key.LEFT) {
            blockCol += TODO;   // ← -1 で左へ
        }
        if (key == Key.RIGHT) {
            blockCol += TODO;   // ← +1 で右へ
        }
        if (key == Key.DOWN) {
            blockRow += TODO;   // ← +1 で下へ
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
