import dev.yasuda.tetris.*;

/**
 * Step 2 — ブロックを1つ置く。
 *
 * 目標: Step 1 の盤面に加えて、赤いブロックを1つ描く。
 *
 * 「TODO」は「ここを埋めてください」の仮値です。正しい値・式に書き換えましょう。
 */
public class MyTetris extends Game {

    static final int COLS = 10;
    static final int ROWS = 20;
    static final int CELL = 24;

    /** 「ここを書き換えてね」の目印。値としてはただの 0。 */
    static final int TODO = 0;

    // ブロックの位置
    int blockCol = TODO;   // ← 中央寄りの列（例: 4）
    int blockRow = TODO;   // ← 上端の行（例: 0）

    public static void main(String[] args) {
        new MyTetris().run();
    }

    @Override
    public void render(Screen screen) {
        screen.clear(Color.BLACK);

        // 空の盤面（Step 1 と同じ）
        for (int row = 0; row < ROWS; row++) {
            for (int col = 0; col < COLS; col++) {
                int x = col * CELL;
                int y = row * CELL;
                screen.fillRect(x + 1, y + 1, CELL - 2, CELL - 2, Color.DARK_GRAY);
            }
        }

        // 盤面の上に赤ブロックを1つ重ねる
        int bx = TODO;   // ← blockCol と CELL から
        int by = TODO;   // ← blockRow と CELL から
        screen.fillRect(TODO, TODO, TODO, TODO, Color.RED);
    }
}
