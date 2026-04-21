import dev.yasuda.othello.*;

/**
 * Step 06 — 手番交代とパス。
 *
 * 目標: 着手後に currentPlayer を交代する。
 *       交代先に合法手が無ければ自動でパスして元の手番に戻す。
 *       両者連続でパスしたら gameOver = true。
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
    boolean gameOver = false;

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
        if (gameOver) return;
        if (key == Key.LEFT  && cursorCol > 0)        cursorCol--;
        if (key == Key.RIGHT && cursorCol < COLS - 1) cursorCol++;
        if (key == Key.UP    && cursorRow > 0)        cursorRow--;
        if (key == Key.DOWN  && cursorRow < ROWS - 1) cursorRow++;
        if (key == Key.ENTER) {
            if (isValidMove(cursorRow, cursorCol, currentPlayer)) {
                placeAt(cursorRow, cursorCol, currentPlayer);
                endTurn();
            }
        }
    }

    void placeAt(int row, int col, int player) {
        board[row][col] = player;
        flip(row, col, player);
    }

    /**
     * 手番を交代し、次の手番が打てなければ自動パス（さらに元に戻す）。
     * 両者連続パスなら gameOver = true。
     */
    void endTurn() {
        // TODO: 次の 3 段階を実装する:
        //   1) currentPlayer を反対側に切り替える
        //   2) 切り替え後に hasAnyLegalMove(currentPlayer) が false なら、
        //      もう一度切り替え（= パス）
        //   3) それでも合法手が無ければ gameOver = true
        TODO;
    }

    /** player に合法手が 1 つでもあれば true。 */
    boolean hasAnyLegalMove(int player) {
        // TODO: 全マスを走査し、isValidMove が true のマスが 1 つでもあれば true。
        TODO;
    }

    void flip(int row, int col, int player) {
        int opponent = (player == BLACK) ? WHITE : BLACK;
        for (int[] d : DIRECTIONS) {
            int dr = d[0];
            int dc = d[1];
            int r = row + dr;
            int c = col + dc;
            while (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] == opponent) {
                r += dr;
                c += dc;
            }
            if (r < 0 || r >= ROWS || c < 0 || c >= COLS) continue;
            if (board[r][c] != player) continue;
            r -= dr;
            c -= dc;
            while (!(r == row && c == col)) {
                board[r][c] = player;
                r -= dr;
                c -= dc;
            }
        }
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
                } else if (!gameOver && isValidMove(row, col, currentPlayer)) {
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
