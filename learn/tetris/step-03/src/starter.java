import dev.yasuda.tetris.*;

/**
 * Step 3 — 自由落下。
 *
 * 目標: ブロックが 1 秒ごとに 1 マス自動で下に落ちる。
 *       下まで行ったら上に戻ってループする。
 *
 * TODO:
 *   update(double dt) を実装してください。
 *   1) accumulator に dt を足していく
 *   2) accumulator が DROP_SECONDS を超えたら:
 *        - accumulator から DROP_SECONDS を引く
 *        - blockRow++
 *        - blockRow が ROWS 以上になったら 0 に戻す
 *   3) 上の処理は while ループで回して、溜まった分を一気に処理できるように
 */
public class MyTetris extends Game {

    static final int COLS = 10;
    static final int ROWS = 20;
    static final int CELL = 24;

    static final double DROP_SECONDS = 1.0;

    int blockCol = 4;
    int blockRow = 0;
    double accumulator = 0.0;

    public static void main(String[] args) {
        new MyTetris().run();
    }

    @Override
    public void update(double dt) {
        // TODO: accumulator に dt を足し、DROP_SECONDS を超えたら blockRow を1進める

    }

    @Override
    public void render(Screen screen) {
        screen.clear(Color.BLACK);

        for (int row = 0; row < ROWS; row++) {
            for (int col = 0; col < COLS; col++) {
                int x = col * CELL;
                int y = row * CELL;
                screen.fillRect(x + 1, y + 1, CELL - 2, CELL - 2, Color.DARK_GRAY);
            }
        }

        int bx = blockCol * CELL;
        int by = blockRow * CELL;
        screen.fillRect(bx + 1, by + 1, CELL - 2, CELL - 2, Color.RED);
    }
}
