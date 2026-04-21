import dev.yasuda.othello.*;

/**
 * Step 04 — 合法手の判定。
 *
 * 目標: 現在の手番（currentPlayer）が置ける場所に、黄色い小さなヒントを
 *       表示する。オセロのルール:「相手の石を 1 つ以上挟めるマスにだけ置ける」。
 *
 * 学ぶこと:
 *  - 8 方向スキャン（dr, dc の組で表現）
 *  - boolean を返すメソッドの設計（早期 return の使い方）
 *  - while ループで 1 マスずつ進む
 */
public class MyOthello extends Game {

    static final int COLS = 8;
    static final int ROWS = 8;
    static final int CELL = 50;

    static final int EMPTY = 0;
    static final int BLACK = 1;
    static final int WHITE = 2;

    static final int[][] DIRECTIONS = {
        {-1, -1}, {-1, 0}, {-1, 1},
        { 0, -1},          { 0, 1},
        { 1, -1}, { 1, 0}, { 1, 1}
    };

    int[][] board = new int[ROWS][COLS];
    int currentPlayer = BLACK;

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

    boolean isValidMove(int row, int col, int player) {
        if (board[row][col] != EMPTY) return false;
        int opponent = (player == BLACK) ? WHITE : BLACK;
        for (int[] d : DIRECTIONS) {
            int dr = d[0];
            int dc = d[1];
            int r = row + dr;
            int c = col + dc;
            boolean sawOpponent = false;
            while (r >= 0 && r < ROWS && c >= 0 && c < COLS) {
                if (board[r][c] == opponent) {
                    sawOpponent = true;
                } else if (board[r][c] == player && sawOpponent) {
                    return true;
                } else {
                    break;
                }
                r += dr;
                c += dc;
            }
        }
        return false;
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
                } else if (isValidMove(row, col, currentPlayer)) {
                    screen.fillCircle(x + CELL / 2, y + CELL / 2, 6, Color.HINT);
                }
            }
        }

        int cx = cursorCol * CELL;
        int cy = cursorRow * CELL;
        screen.strokeRect(cx,     cy,     CELL,     CELL,     Color.HIGHLIGHT);
        screen.strokeRect(cx + 1, cy + 1, CELL - 2, CELL - 2, Color.HIGHLIGHT);
        screen.strokeRect(cx + 2, cy + 2, CELL - 4, CELL - 4, Color.HIGHLIGHT);
    }
}
