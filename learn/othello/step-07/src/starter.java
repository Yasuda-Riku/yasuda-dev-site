import dev.yasuda.othello.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

/**
 * Step 07 — ランダム AI。
 *
 * 目標: 白番になったら AI が少し待ってから自動で手を打つ。
 *       合法手の一覧を List として取得し、Random で 1 手選ぶだけ。
 */
public class MyOthello extends Game {

    static final int COLS = 8;
    static final int ROWS = 8;
    static final int CELL = 50;

    static final int EMPTY = 0;
    static final int BLACK = 1;
    static final int WHITE = 2;

    static final int HUMAN = BLACK;
    static final int AI    = WHITE;

    static final double AI_DELAY = 0.5;  // 秒

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

    Random rng = new Random();
    double aiCooldown = 0.0;

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
    public void update(double dt) {
        // AI の手番でなければ何もしない。
        if (gameOver || currentPlayer != AI) {
            aiCooldown = 0.0;
            return;
        }
        aiCooldown += dt;
        if (aiCooldown < AI_DELAY) return;
        aiCooldown = 0.0;
        aiMove();
    }

    void aiMove() {
        // TODO: AI 側の合法手一覧を legalMoves(AI) で取得。空なら何もしない。
        //       空でなければ rng.nextInt(サイズ) で 1 手選び、placeAt → endTurn。
        TODO;
    }

    /** player が合法に打てるマス (row, col) を List で返す。 */
    List<int[]> legalMoves(int player) {
        // TODO: 2 重 for で全マスを走査し、isValidMove が true のマスを
        //       new int[]{r, c} として ArrayList に add。最後に return。
        TODO;
    }

    @Override
    public void onKey(Key key) {
        if (gameOver || currentPlayer != HUMAN) return;
        if (key == Key.LEFT  && cursorCol > 0)        cursorCol--;
        if (key == Key.RIGHT && cursorCol < COLS - 1) cursorCol++;
        if (key == Key.UP    && cursorRow > 0)        cursorRow--;
        if (key == Key.DOWN  && cursorRow < ROWS - 1) cursorRow++;
        if (key == Key.ENTER) {
            if (isValidMove(cursorRow, cursorCol, HUMAN)) {
                placeAt(cursorRow, cursorCol, HUMAN);
                endTurn();
            }
        }
    }

    void placeAt(int row, int col, int player) {
        board[row][col] = player;
        flip(row, col, player);
    }

    void endTurn() {
        currentPlayer = (currentPlayer == BLACK) ? WHITE : BLACK;
        if (!hasAnyLegalMove(currentPlayer)) {
            currentPlayer = (currentPlayer == BLACK) ? WHITE : BLACK;
            if (!hasAnyLegalMove(currentPlayer)) {
                gameOver = true;
            }
        }
    }

    boolean hasAnyLegalMove(int player) {
        for (int r = 0; r < ROWS; r++)
            for (int c = 0; c < COLS; c++)
                if (isValidMove(r, c, player)) return true;
        return false;
    }

    void flip(int row, int col, int player) {
        int opponent = (player == BLACK) ? WHITE : BLACK;
        for (int[] d : DIRECTIONS) {
            int dr = d[0], dc = d[1];
            int r = row + dr, c = col + dc;
            while (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] == opponent) {
                r += dr; c += dc;
            }
            if (r < 0 || r >= ROWS || c < 0 || c >= COLS) continue;
            if (board[r][c] != player) continue;
            r -= dr; c -= dc;
            while (!(r == row && c == col)) {
                board[r][c] = player;
                r -= dr; c -= dc;
            }
        }
    }

    boolean isValidMove(int row, int col, int player) {
        if (board[row][col] != EMPTY) return false;
        int opponent = (player == BLACK) ? WHITE : BLACK;
        for (int[] d : DIRECTIONS) {
            int dr = d[0], dc = d[1];
            int r = row + dr, c = col + dc;
            boolean sawOpponent = false;
            while (r >= 0 && r < ROWS && c >= 0 && c < COLS) {
                if (board[r][c] == opponent) {
                    sawOpponent = true;
                } else if (board[r][c] == player && sawOpponent) {
                    return true;
                } else {
                    break;
                }
                r += dr; c += dc;
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
                } else if (!gameOver && currentPlayer == HUMAN && isValidMove(row, col, HUMAN)) {
                    screen.fillCircle(x + CELL / 2, y + CELL / 2, 6, Color.HINT);
                }
            }
        }

        if (currentPlayer == HUMAN) {
            int cx = cursorCol * CELL;
            int cy = cursorRow * CELL;
            screen.strokeRect(cx,     cy,     CELL,     CELL,     Color.HIGHLIGHT);
            screen.strokeRect(cx + 1, cy + 1, CELL - 2, CELL - 2, Color.HIGHLIGHT);
            screen.strokeRect(cx + 2, cy + 2, CELL - 4, CELL - 4, Color.HIGHLIGHT);
        }
    }
}
