import dev.yasuda.othello.*;

/**
 * Step 03 — カーソル操作。
 *
 * 目標: 矢印キーで盤面上のカーソルを動かし、現在位置を HIGHLIGHT 色の
 *       太めの枠で示す。盤面の端では止まる（はみ出さない）。
 *
 * 学ぶこと:
 *  - onKey でキー入力を受ける
 *  - Key enum による分岐
 *  - 境界クランプ（0 以上 ROWS/COLS 未満）
 *  - 重ね描き: strokeRect を 2 本重ねて「太い枠」を表現
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
        if (key == Key.LEFT  && cursorCol > 0)        cursorCol--;
        if (key == Key.RIGHT && cursorCol < COLS - 1) cursorCol++;
        if (key == Key.UP    && cursorRow > 0)        cursorRow--;
        if (key == Key.DOWN  && cursorRow < ROWS - 1) cursorRow++;
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

        // カーソル：3 本重ねて太く見せる
        int cx = cursorCol * CELL;
        int cy = cursorRow * CELL;
        screen.strokeRect(cx,     cy,     CELL,     CELL,     Color.HIGHLIGHT);
        screen.strokeRect(cx + 1, cy + 1, CELL - 2, CELL - 2, Color.HIGHLIGHT);
        screen.strokeRect(cx + 2, cy + 2, CELL - 4, CELL - 4, Color.HIGHLIGHT);
    }
}
