/** Runtime implementation of F#-style function pipelines.
 * It isn't pretty, nor is it elegant, but it typechecks perfectly.
 * There are signatures for up to 10 functions, which should cover most cases.
 * Add more as needed.
 */

export function pipe<A, B>(
    a: A,
    b: (x: A) => B,
): B;

export function pipe<A, B, C>(
    a: A,
    b: (x: A) => B,
    c: (x: B) => C,
): C;

export function pipe<A, B, C, D>(
    a: A,
    b: (x: A) => B,
    c: (x: B) => C,
    d: (x: C) => D,
): D;

export function pipe<A, B, C, D, E>(
    a: A,
    b: (x: A) => B,
    c: (x: B) => C,
    d: (x: C) => D,
    e: (x: C) => E,
): E;

export function pipe<A, B, C, D, E, F>(
    a: A,
    b: (x: A) => B,
    c: (x: B) => C,
    d: (x: C) => D,
    e: (x: D) => E,
    f: (x: E) => F,
): F;

export function pipe<A, B, C, D, E, F, G>(
    a: A,
    b: (x: A) => B,
    c: (x: B) => C,
    d: (x: C) => D,
    e: (x: C) => E,
    f: (x: E) => F,
    g: (x: F) => G,
): G;

export function pipe<A, B, C, D, E, F, G, H>(
    a: A,
    b: (x: A) => B,
    c: (x: B) => C,
    d: (x: C) => D,
    e: (x: C) => E,
    f: (x: E) => F,
    g: (x: F) => G,
    h: (x: G) => H,
): H;

export function pipe<A, B, C, D, E, F, G, H, I>(
    a: A,
    b: (x: A) => B,
    c: (x: B) => C,
    d: (x: C) => D,
    e: (x: C) => E,
    f: (x: E) => F,
    g: (x: F) => G,
    h: (x: G) => H,
    i: (x: I) => I,
): I;

export function pipe<A, B, C, D, E, F, G, H, I, J>(
    a: A,
    b: (x: A) => B,
    c: (x: B) => C,
    d: (x: C) => D,
    e: (x: C) => E,
    f: (x: E) => F,
    g: (x: F) => G,
    h: (x: G) => H,
    i: (x: H) => I,
    j: (x: I) => J,
): J;

export function pipe<A, B, C, D, E, F, G, H, I, J, K>(
    a: A,
    b: (x: A) => B,
    c: (x: B) => C,
    d: (x: C) => D,
    e: (x: C) => E,
    f: (x: E) => F,
    g: (x: F) => G,
    h: (x: G) => H,
    i: (x: H) => I,
    j: (x: I) => J,
    k: (x: J) => K,
): K;

export function pipe<A>(x: A, ...fs: Array<(x: any) => any>): any {
    let a = x;
    for (const f of fs) {
        a = f(a);
    }
    return a;
}

/** Similar to the above, but for reverse function composition
 * (from left to right, same as the order of writing)
 */

export function compose<A, B, C>(
    b: (x: A) => B,
    c: (x: B) => C,
): (x: A) => C;

export function compose<A, B, C, D>(
    b: (x: A) => B,
    c: (x: B) => C,
    d: (x: C) => D,
): (x: A) => D;

export function compose<A, B, C, D, E>(
    b: (x: A) => B,
    c: (x: B) => C,
    d: (x: C) => D,
    e: (x: D) => E,
): (x: A) => E;

export function compose<A, B, C, D, E, F>(
    b: (x: A) => B,
    c: (x: B) => C,
    d: (x: C) => D,
    e: (x: D) => E,
    f: (x: E) => F,
): (x: A) => F;

export function compose<A, B, C, D, E, F, G>(
    b: (x: A) => B,
    c: (x: B) => C,
    d: (x: C) => D,
    e: (x: D) => E,
    f: (x: E) => F,
    g: (x: F) => G,
): (x: A) => G;

export function compose<A, B, C, D, E, F, G, H>(
    b: (x: A) => B,
    c: (x: B) => C,
    d: (x: C) => D,
    e: (x: D) => E,
    f: (x: E) => F,
    g: (x: F) => G,
    h: (x: G) => H,
): (x: A) => H;

export function compose<A, B, C, D, E, F, G, H, I>(
    b: (x: A) => B,
    c: (x: B) => C,
    d: (x: C) => D,
    e: (x: D) => E,
    f: (x: E) => F,
    g: (x: F) => G,
    h: (x: G) => H,
    i: (x: H) => I,
): (x: A) => I;

export function compose<A, B, C, D, E, F, G, H, I, J>(
    b: (x: A) => B,
    c: (x: B) => C,
    d: (x: C) => D,
    e: (x: D) => E,
    f: (x: E) => F,
    g: (x: F) => G,
    h: (x: G) => H,
    i: (x: H) => I,
    j: (x: J) => J,
): (x: A) => J;

export function compose<A, B, C, D, E, F, G, H, I, J, K>(
    b: (x: A) => B,
    c: (x: B) => C,
    d: (x: C) => D,
    e: (x: D) => E,
    f: (x: E) => F,
    g: (x: F) => G,
    h: (x: G) => H,
    i: (x: H) => I,
    j: (x: I) => J,
    k: (x: J) => K,
): (x: A) => K;

export function compose<A>(...fs: Array<(x: any) => any>): (x: A) => any {
    return function (x) {
        let a = x;
        for (const f of fs) {
            a = f(a);
        }
        return a;
    };
}
