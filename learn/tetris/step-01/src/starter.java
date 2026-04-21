import dev.yasuda.tetris.*;

/**
 * Step 1 — 盤面を描く。
 *
 * 目標: 10 × 20 の空のグリッドを画面に表示する。
 *
 * コード中の「TODO」は「ここを埋めてください」という意味の仮の値です。
 * TODO は未定義なので、残ったまま Run するとコンパイルエラーになります。
 * 正しい式に書き換えるとエラーが消えて盤面が表示されます。
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
                // マスの左上の座標を計算する
                int x = TODO;   // ← col と CELL から
                int y = TODO;   // ← row と CELL から

                // 位置・サイズを埋める（+1 / -2 で隣と隙間を作るのが定番）
                screen.fillRect(TODO, TODO, TODO, TODO, Color.DARK_GRAY);
            }
        }
    }
}
