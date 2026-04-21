import dev.yasuda.tetris.*;
import java.util.Random;

/**
 * Step 8 — ミノをランダムに出す。
 *
 * 目標: Step 7 の「順番」抽選を「ランダム」抽選に変える。
 *       差分は spawnNext の 1 行だけ。
 *
 * TODO は未定義の識別子です。残したまま Run するとコンパイルエラーになります。
 */
public class MyTetris extends Game {

    static final int COLS = 10;
    static final int ROWS = 20;
    static final int CELL = 24;
    static final double DROP_SECONDS = 1.0;
    enum Shape {
        I(Color.CYAN,   new int[][]{ {0,0,0,0}, {1,1,1,1}, {0,0,0,0}, {0,0,0,0} }),
        O(Color.YELLOW, new int[][]{ {1,1}, {1,1} }),
        T(Color.PURPLE, new int[][]{ {0,1,0}, {1,1,1}, {0,0,0} }),
        S(Color.GREEN,  new int[][]{ {0,1,1}, {1,1,0}, {0,0,0} }),
        Z(Color.RED,    new int[][]{ {1,1,0}, {0,1,1}, {0,0,0} }),
        L(Color.ORANGE, new int[][]{ {0,0,1}, {1,1,1}, {0,0,0} }),
        J(Color.BLUE,   new int[][]{ {1,0,0}, {1,1,1}, {0,0,0} });

        final Color color;
        final int[][] cells;
        Shape(Color color, int[][] cells) {
            this.color = color; this.cells = cells;
        }
    }

    int[][] board = new int[ROWS][COLS];
    Shape[] bag = Shape.values();
    Random rng = new Random();

    Shape current = bag[0];
    int pieceCol = 3;
    int pieceRow = 0;
    double accumulator = 0.0;

    public static void main(String[] args) {
        new MyTetris().run();
    }

    @Override
    public void update(double dt) {
        accumulator += dt;
        while (accumulator >= DROP_SECONDS) {
            accumulator -= DROP_SECONDS;
            if (canMove(current, pieceCol, pieceRow + 1)) {
                pieceRow++;
            } else {
                lockPiece();
                spawnNext();
            }
        }
    }

    @Override
    public void onKey(Key key) {
        if (key == Key.LEFT  && canMove(current, pieceCol - 1, pieceRow)) pieceCol--;
        if (key == Key.RIGHT && canMove(current, pieceCol + 1, pieceRow)) pieceCol++;
        if (key == Key.DOWN  && canMove(current, pieceCol, pieceRow + 1)) pieceRow++;
    }

    boolean canMove(Shape shape, int col, int row) {
        int[][] cells = shape.cells;
        for (int r = 0; r < cells.length; r++) {
            for (int c = 0; c < cells[r].length; c++) {
                if (cells[r][c] == 0) continue;
                int bc = col + c;
                int br = row + r;
                if (bc < 0 || bc >= COLS) return false;
                if (br < 0 || br >= ROWS) return false;
                if (board[br][bc] != 0)   return false;
            }
        }
        return true;
    }

    void lockPiece() {
        int[][] cells = current.cells;
        for (int r = 0; r < cells.length; r++) {
            for (int c = 0; c < cells[r].length; c++) {
                if (cells[r][c] == 0) continue;
                board[pieceRow + r][pieceCol + c] = current.ordinal() + 1;
            }
        }
    }

    /** 次のミノをランダムに決める。 */
    void spawnNext() {
        // TODO: 0..bag.length-1 のランダムな整数を rng.nextInt(bag.length) で得て、
        //       それを bag のインデックスにして current にセットする。
        current = bag[TODO];
        pieceCol = 3;
        pieceRow = 0;
    }

    @Override
    public void render(Screen screen) {
        screen.clear(Color.BLACK);

        for (int row = 0; row < ROWS; row++) {
            for (int col = 0; col < COLS; col++) {
                int x = col * CELL;
                int y = row * CELL;
                int cell = board[row][col];
                Color c = (cell == 0) ? Color.DARK_GRAY : bag[cell - 1].color;
                screen.fillRect(x + 1, y + 1, CELL - 2, CELL - 2, c);
            }
        }

        int[][] cells = current.cells;
        for (int r = 0; r < cells.length; r++) {
            for (int c = 0; c < cells[r].length; c++) {
                if (cells[r][c] == 0) continue;
                int x = (pieceCol + c) * CELL;
                int y = (pieceRow + r) * CELL;
                screen.fillRect(x + 1, y + 1, CELL - 2, CELL - 2, current.color);
            }
        }
    }
}
