import dev.yasuda.othello.*;

/**
 * Step 01 — 8×8 の盤面を描く。
 *
 * 目標: 緑の背景の上に、8×8 のマス目を格子線で区切って描画する。
 *
 * TODO は未定義の識別子です。残したまま Run するとコンパイルエラーになります。
 * このコースでは、Tetris と違って「TODO の塊を自分でコードに書き換える」のが基本です。
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
                // TODO: このマスの左上座標 (x, y) を col/row/CELL から求め、
                //       Color.BOARD でマス本体、Color.BOARD_LINE で枠線を重ねる。
                //       使うメソッドは screen.fillRect と screen.strokeRect。
                TODO;
            }
        }
    }
}
