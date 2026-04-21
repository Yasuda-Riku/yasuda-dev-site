package dev.yasuda.tetris;

import java.io.File;
import java.lang.reflect.Method;
import java.net.URL;
import java.net.URLClassLoader;

/**
 * Reloads the student's MyTetris class from disk and runs its main().
 *
 * CheerpJ 4.2's cheerpjRunLibrary can only be called once per page, so
 * we can't just re-create the library object every Run. Instead, JS
 * calls Loader.loadAndRun(...) every Run: we open a fresh
 * URLClassLoader pointing at the compile output directory, load
 * MyTetris.class anew, and invoke its static main. The previous
 * instance parked in Game.current becomes unreachable and gets GC'd.
 */
public final class Loader {

    private Loader() {}

    /**
     * Load and run the student's main class.
     * @param classDir     the directory holding the compiled .class file
     *                     (e.g. "/files/")
     * @param mainClassName the fully-qualified class name, e.g. "MyTetris"
     */
    public static void loadAndRun(String classDir, String mainClassName) throws Exception {
        Game.resetCurrent();

        URL url = new File(classDir).toURI().toURL();
        URLClassLoader cl = new URLClassLoader(
            new URL[] { url },
            Loader.class.getClassLoader()
        );
        Class<?> clazz = cl.loadClass(mainClassName);
        Method main = clazz.getMethod("main", String[].class);
        main.invoke(null, (Object) new String[0]);
    }
}
