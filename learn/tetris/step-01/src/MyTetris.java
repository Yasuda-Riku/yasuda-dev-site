import dev.yasuda.tetris.*;

/**
 * Step 1 — 盤面を描く。
 *
 * 目標: 10 × 20 の空のグリッドを画面に表示する。
 * 学ぶこと: 2次元ループ、Screen.fillRect、定数の使い方。
 */
public class MyTetris extends Game {

    static final int COLS = 10;
    static final int ROWS = 20;
    static final int CELL = 24;

    public static void main(String[] args) {
        new MyTetris().run();
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
    }
}
