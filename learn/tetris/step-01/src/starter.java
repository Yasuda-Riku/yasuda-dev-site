import dev.yasuda.tetris.*;

/**
 * Step 1 — 盤面を描く。
 *
 * 目標: 10 × 20 の空のグリッドを画面に表示する。
 *
 * TODO:
 *   render() の中に 2 重ループを書いて、盤面の全マスを
 *   暗いグレー (Color.DARK_GRAY) で塗ってください。
 *
 * 使うもの:
 *   - 2 重の for ループ (row 0..ROWS, col 0..COLS)
 *   - 左上座標: col * CELL, row * CELL
 *   - 隣のマスと 1px ずつ隙間を空けるなら +1, -2
 *   - screen.fillRect(x, y, width, height, color)
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

        // TODO: ここに 2 重ループを書いて、各マスを塗る

    }
}
