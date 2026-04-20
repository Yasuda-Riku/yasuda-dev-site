import dev.yasuda.tetris.*;

/**
 * Step 2 — ブロックを1つ置く。
 *
 * 目標: Step 1 の盤面に加えて、赤いブロックを1つ描く。
 *
 * TODO:
 *   1) ブロックの位置フィールド blockCol / blockRow を初期化する
 *      （例: 列 4 ・ 行 0 からスタート）
 *   2) render() の末尾で、ブロック1つを赤で描く（位置とサイズを埋める）
 */
public class MyTetris extends Game {

    static final int COLS = 10;
    static final int ROWS = 20;
    static final int CELL = 24;

    // TODO 1: フィールド変数をダミー値 0 から正しい初期値に変える
    int blockCol = 0;
    int blockRow = 0;

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
        // TODO 2: bx, by を blockCol / blockRow / CELL から計算する
        int bx = 0;
        int by = 0;
        // TODO 2: fillRect の位置・サイズを埋める（(x+1, y+1) と (CELL-2) 四方）
        screen.fillRect(0, 0, CELL, CELL, Color.RED);
    }
}
