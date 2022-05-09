export function I<T>(x: T): T {
    return x;
}

export function D<X, Y, Z>(a: (x: X) => (y: Y) => Z): {
    <A, B>(b: (x: A) => X, c: (x: B) => Y): {
        (d: A): {
            (d: B): Z
        }
    }
} {
    return (b, c) => d => e => a(b(d))(c(e));
}

export function DR<X, Y, Z>(a: (x: X) => (y: Y) => Z): {
    <A>(b: (x: A) => Y): {
        (c: X): {
            (d: A): Z
        }
    }
} {
    return b => c => d => a(c)(b(d));
}

export function DL<X, Y, Z>(a: (x: X) => (y: Y) => Z): {
    <A>(b: (x: A) => X): {
        (c: A): {
            (d: Y): Z
        }
    }
} {
    return b => c => d => a(b(c))(d);
}