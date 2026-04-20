import dev.yasuda.tetris.*;

/**
 * Step 2 — ブロックを1つ置く。
 *
 * 目標: Step 1 の盤面に加えて、赤いブロックを1つ描く。
 *
 * TODO:
 *   1) フィールド変数 blockCol / blockRow を宣言（例: 4 と 0）
 *   2) render() の盤面描画のあとに、ブロック1つの fillRect を追加
 *
 *   ブロックの左上座標: blockCol * CELL, blockRow * CELL
 *   色: Color.RED
 */
public class MyTetris extends Game {

    static final int COLS = 10;
    static final int ROWS = 20;
    static final int CELL = 24;

    // TODO 1: フィールド変数 blockCol と blockRow を宣言する


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

        // TODO 2: 盤面の上に赤ブロックを1つ重ねる

    }
}
