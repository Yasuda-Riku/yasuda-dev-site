import dev.yasuda.othello.*;

/**
 * Step 02 — 中央 4 マスに初期配置を置く。
 *
 * 目標: 盤面配列 board に初期配置を記録し、render で石を描く。
 *       オセロの初期配置は中央 4 マス:
 *         (col=3, row=3) = 白
 *         (col=4, row=4) = 白
 *         (col=4, row=3) = 黒
 *         (col=3, row=4) = 黒
 *
 * ヒント: 石の代入は board[row][col] = 値 の順（行が先）。
 */
public class MyOthello extends Game {

    static final int COLS = 8;
    static final int ROWS = 8;
    static final int CELL = 50;

    static final int EMPTY = 0;
    static final int BLACK = 1;
    static final int WHITE = 2;

    int[][] board = new int[ROWS][COLS];

    public static void main(String[] args) {
        new MyOthello().run();
    }

    @Override
    public void setup() {
        // TODO: 中央 4 マスに初期配置を入れる。
        //       (3,3) と (4,4) は WHITE、(4,3) と (3,4) は BLACK。
        TODO;
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

                // TODO: board[row][col] が EMPTY でなければ石を描く。
                //       中心は (x + CELL/2, y + CELL/2)、半径は CELL/2 - 4。
                //       BLACK なら Color.BLACK、WHITE なら Color.WHITE。
                //       使うメソッドは screen.fillCircle(cx, cy, radius, color)。
                TODO;
            }
        }
    }
}
