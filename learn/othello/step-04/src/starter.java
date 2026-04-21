import dev.yasuda.othello.*;

/**
 * Step 04 — 合法手の判定。
 *
 * 目標: currentPlayer が置けるマスに、黄色い小さな点（Color.HINT）を表示する。
 *       オセロのルール: 相手の石を 1 つ以上挟めるマスにだけ置ける。
 *
 * この Step の山場は isValidMove メソッドを自分で書くこと。
 * 「8 方向に 1 マスずつ進んで、相手の石が続いた後に自分の石があれば挟める」
 * が骨子。
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

    /**
     * (row, col) に player が置けるなら true。
     *
     * アルゴリズム:
     *   1) board[row][col] が EMPTY でなければ即 false
     *   2) opponent を求める（player が BLACK なら WHITE、逆も同様）
     *   3) 8 方向それぞれについて、1 マスずつ進みながら:
     *      - 相手の石なら sawOpponent = true にして進む
     *      - 自分の石で、かつ sawOpponent が true なら true を返す
     *      - 空マスまたは自分の石で sawOpponent == false なら break
     *   4) どの方向でも挟めなかったら false
     */
    boolean isValidMove(int row, int col, int player) {
        // TODO: 上のアルゴリズムを実装する。
        //       方向は DIRECTIONS 配列を for-each で回すと楽: for (int[] d : DIRECTIONS) { ... }
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
                } else if (isValidMove(row, col, currentPlayer)) {
                    // 合法手マーカー（小さな黄色い点）
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
