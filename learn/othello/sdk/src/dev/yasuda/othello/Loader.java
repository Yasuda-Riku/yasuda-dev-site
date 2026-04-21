package dev.yasuda.othello;

import java.io.File;
import java.lang.reflect.Method;
import java.net.URL;
import java.net.URLClassLoader;

/**
 * Reloads the student's MyOthello class from disk and runs its main().
 */
public final class Loader {

    private Loader() {}

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
