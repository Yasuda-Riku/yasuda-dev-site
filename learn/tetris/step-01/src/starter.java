import dev.yasuda.tetris.*;

/**
 * Step 1 — 盤面を描く。
 *
 * 目標: 10 × 20 の空のグリッドを画面に表示する。
 *
 * 下のコードはほぼ完成形ですが、TODO の5か所がダミー値 (0 / CELL) のままです。
 * 正しい式に書き換えて、盤面が表示されるようにしてください。
 *
 * 使うもの:
 *   - 座標計算: col * CELL, row * CELL
 *   - fillRect(x, y, width, height, color)
 *   - 隣のマスと 1px 隙間を空けるなら +1 / -2
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
                // TODO: マスの左上の座標を計算する
                int x = 0;   // ← col と CELL から
                int y = 0;   // ← row と CELL から

                // TODO: 塗る位置・サイズを埋める（(x+1, y+1) の位置に (CELL-2) 四方）
                screen.fillRect(0, 0, CELL, CELL, Color.DARK_GRAY);
            }
        }
    }
}
