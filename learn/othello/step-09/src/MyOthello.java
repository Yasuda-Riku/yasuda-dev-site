import dev.yasuda.othello.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Step 09 — minimax。
 *
 * 目標: 数手先を読む AI に進化させる。自分の手番では「評価を最大にする手」、
 *       相手の手番では「評価を最小にする手」を再帰的に選ぶ（相手は最善を指す前提）。
 *
 * 学ぶこと:
 *  - 再帰と base case（depth == 0 / 終局）
 *  - maximizing / minimizing の切り替え
 *  - パスの扱い（合法手が無い時に手番だけ戻して再帰）
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

    static final double AI_DELAY = 0.5;
    static final int MAX_DEPTH = 2;

    static final int[][] DIRECTIONS = {
        {-1, -1}, {-1, 0}, {-1, 1},
        { 0, -1},          { 0, 1},
        { 1, -1}, { 1, 0}, { 1, 1}
    };

    static final int[][] POSITION_WEIGHTS = {
        {120, -20,  20,   5,   5,  20, -20, 120},
        {-20, -40,  -5,  -5,  -5,  -5, -40, -20},
        { 20,  -5,  15,   3,   3,  15,  -5,  20},
        {  5,  -5,   3,   3,   3,   3,  -5,   5},
        {  5,  -5,   3,   3,   3,   3,  -5,   5},
        { 20,  -5,  15,   3,   3,  15,  -5,  20},
        {-20, -40,  -5,  -5,  -5,  -5, -40, -20},
        {120, -20,  20,   5,   5,  20, -20, 120}
    };

    int[][] board = new int[ROWS][COLS];
    int currentPlayer = BLACK;
    boolean gameOver = false;

    int cursorCol = 3;
    int cursorRow = 3;

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
        List<int[]> moves = legalMoves(AI);
        if (moves.isEmpty()) return;
        int[] best = moves.get(0);
        int bestScore = Integer.MIN_VALUE;
        for (int[] m : moves) {
            int[][] snap = snapshot();
            placeAt(m[0], m[1], AI);
            int score = minimax(MAX_DEPTH - 1, HUMAN);
            restore(snap);
            if (score > bestScore) {
                bestScore = score;
                best = m;
            }
        }
        placeAt(best[0], best[1], AI);
        endTurn();
    }

    /**
     * player の手番の局面を評価する（AI 視点のスコア）。
     * - depth == 0 または 終局なら evaluate(AI) を返す
     * - player が AI なら最大化、HUMAN なら最小化
     * - 合法手が無ければパス（相手の手番で 1 段浅く再帰）
     */
    int minimax(int depth, int player) {
        if (depth == 0) return evaluate(AI);
        List<int[]> moves = legalMoves(player);
        int opponent = (player == BLACK) ? WHITE : BLACK;
        if (moves.isEmpty()) {
            if (legalMoves(opponent).isEmpty()) return evaluate(AI);
            return minimax(depth - 1, opponent);
        }
        boolean maximizing = (player == AI);
        int best = maximizing ? Integer.MIN_VALUE : Integer.MAX_VALUE;
        for (int[] m : moves) {
            int[][] snap = snapshot();
            placeAt(m[0], m[1], player);
            int score = minimax(depth - 1, opponent);
            restore(snap);
            if (maximizing) best = Math.max(best, score);
            else           best = Math.min(best, score);
        }
        return best;
    }

    int evaluate(int player) {
        int opponent = (player == BLACK) ? WHITE : BLACK;
        int score = 0;
        for (int r = 0; r < ROWS; r++)
            for (int c = 0; c < COLS; c++)
                if (board[r][c] == player) score += POSITION_WEIGHTS[r][c];
                else if (board[r][c] == opponent) score -= POSITION_WEIGHTS[r][c];
        return score;
    }

    int[][] snapshot() {
        int[][] out = new int[ROWS][COLS];
        for (int r = 0; r < ROWS; r++) System.arraycopy(board[r], 0, out[r], 0, COLS);
        return out;
    }

    void restore(int[][] snap) {
        for (int r = 0; r < ROWS; r++) System.arraycopy(snap[r], 0, board[r], 0, COLS);
    }

    List<int[]> legalMoves(int player) {
        List<int[]> out = new ArrayList<>();
        for (int r = 0; r < ROWS; r++)
            for (int c = 0; c < COLS; c++)
                if (isValidMove(r, c, player)) out.add(new int[]{r, c});
        return out;
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
