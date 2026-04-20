import dev.yasuda.tetris.*;

/**
 * Step 2 — ブロックを1つ置く。
 *
 * 目標: 盤面の中央上寄りに、赤いブロックを1つ表示する。
 * 学ぶこと: フィールド変数（blockCol / blockRow）で状態を持ち、
 *           盤面の上にもう一度 fillRect を重ねる描画の「順番」。
 */
public class MyTetris extends Game {

    static final int COLS = 10;
    static final int ROWS = 20;
    static final int CELL = 24;

    // ブロックが今どこにあるか（列・行）
    int blockCol = 4;
    int blockRow = 0;

    public static void main(String[] args) {
        new MyTetris().run();
    }

    @Override
    public void render(Screen screen) {
        screen.clear(Color.BLACK);

        // --- 空の盤面（Step 1 と同じ） ---
        for (int row = 0; row < ROWS; row++) {
            for (int col = 0; col < COLS; col++) {
                int x = col * CELL;
                int y = row * CELL;
                screen.fillRect(x + 1, y + 1, CELL - 2, CELL - 2, Color.DARK_GRAY);
            }
        }

        // --- 盤面の上に赤ブロックを1つ重ねる ---
        int bx = blockCol * CELL;
        int by = blockRow * CELL;
        screen.fillRect(bx + 1, by + 1, CELL - 2, CELL - 2, Color.RED);
    }
}
