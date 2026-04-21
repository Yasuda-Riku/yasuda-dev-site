import dev.yasuda.othello.*;

/**
 * Step 01 — 8×8 の盤面を描く。
 *
 * 目標: 緑の背景の上に、8×8 のマス目を格子線で区切って描画する。
 *
 * 学ぶこと:
 *  - 2 重ループで盤面の全マスを走査する
 *  - Screen.fillRect でマス本体を、strokeRect で枠線を描く
 *  - 定数（static final）で盤面サイズとセルサイズを束ねる
 */
public class MyOthello extends Game {

    static final int COLS = 8;
    static final int ROWS = 8;
    static final int CELL = 50;

    public static void main(String[] args) {
        new MyOthello().run();
    }

    @Override
    public void render(Screen screen) {
        screen.clear(Color.DARK_GRAY);

        for (int row = 0; row < ROWS; row++) {
            for (int col = 0; col < COLS; col++) {
                int x = col * CELL;
                int y = row * CELL;
                screen.fillRect(x, y, CELL, CELL, Color.BOARD);
                screen.strokeRect(x, y, CELL, CELL, Color.BOARD_LINE);
            }
        }
    }
}
