import dev.yasuda.othello.*;

/**
 * Step 03 — カーソル操作。
 *
 * 目標: 矢印キーで盤面上のカーソルを動かし、その位置を HIGHLIGHT 色の
 *       枠で示す。盤面の端で止まること（はみ出さない）。
 */
public class MyOthello extends Game {

    static final int COLS = 8;
    static final int ROWS = 8;
    static final int CELL = 50;

    static final int EMPTY = 0;
    static final int BLACK = 1;
    static final int WHITE = 2;

    int[][] board = new int[ROWS][COLS];

    int cursorCol = 3;
    int cursorRow = 3;

    public static void main(String[] args) {
        new MyOthello().run();
    }

    @Override
    public void setup() {
        board[3][3] = WHITE;
        board[4][4] = WHITE;
        board[3][4] = BLACK;
        board[4][3] = BLACK;
    }

    @Override
    public void onKey(Key key) {
        // TODO: LEFT/RIGHT/UP/DOWN に応じて cursorCol / cursorRow を更新する。
        //       ただし 0 未満や COLS/ROWS 以上にはならないようにする。
        //       参考: if (key == Key.LEFT && cursorCol > 0) cursorCol--;
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

                int stone = board[row][col];
                if (stone != EMPTY) {
                    Color c = (stone == BLACK) ? Color.BLACK : Color.WHITE;
                    screen.fillCircle(x + CELL / 2, y + CELL / 2, CELL / 2 - 4, c);
                }
            }
        }

        // TODO: カーソル位置 (cursorCol, cursorRow) のマスに HIGHLIGHT 色の
        //       枠を描く。strokeRect は 1px 線なので、少しずらしながら
        //       2〜3 本重ねて「太い枠」に見せる。
        //       左上座標は (cursorCol * CELL, cursorRow * CELL)。
        TODO;
    }
}
