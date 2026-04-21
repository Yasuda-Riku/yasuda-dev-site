import dev.yasuda.othello.*;

/**
 * Step 02 — 中央 4 マスに初期配置を置く。
 *
 * 目標: 盤面配列 board に初期配置を記録し、render で石を描く。
 *       オセロの初期配置は中央 4 マス: (3,3)=白、(4,4)=白、(3,4)=黒、(4,3)=黒。
 *
 * 学ぶこと:
 *  - int[][] の 2 次元配列で盤面の状態を持つ
 *  - setup() はゲーム開始時に 1 回だけ呼ばれる
 *  - Screen.fillCircle で石を描く（新しい API）
 *  - 定数で「石の種類」を表す（EMPTY / BLACK / WHITE）
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
        board[3][3] = WHITE;
        board[4][4] = WHITE;
        board[3][4] = BLACK;
        board[4][3] = BLACK;
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
                    int cx = x + CELL / 2;
                    int cy = y + CELL / 2;
                    int r  = CELL / 2 - 4;
                    screen.fillCircle(cx, cy, r, c);
                }
            }
        }
    }
}
