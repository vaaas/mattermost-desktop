// Copyright (c) 2016-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

// Utility functions for data structures.

export interface ObjectMap<T> {
    [key: string|number]: T;
};

export function isIterable(x: any): boolean {
    if (x == null) {
        return false;
    } else {
        return typeof x[Symbol.iterator] === 'function';
    }
}

/** generic implementation of map */
export function map<A, B>(f: (x: A) => B): {
    (xs: Array<A>): Array<B>,
    (xs: Promise<A>): Promise<B>,
    (xs: Set<A>): Set<B>,
    <K>(xs: Map<K, A>): Map<K, B>,
    (xs: ObjectMap<A>: ObjectMap<B>,
    (xs: Iterable<A>): Iterable<B>,
    (xs: any): any,
} {
    return function (xs) {
        if (!xs) {
            throw new TypeError('invalid collection type');
        } else if (Array.isArray(xs)) {
            return xs.map(f);
        } else if (xs instanceof Promise) {
            return xs.then(f);
        } else if (xs instanceof Set) {
            return mapSet(f, xs);
        } else if (xs instanceof Map) {
            return mapMap(f, xs);
        } else if (isIterable(xs)) {
            return mapIterable(f, xs);
        } else if (typeof xs === 'object') {
            return mapRecord(f, xs);
        } else {
            throw new TypeError('invalid collection type');
        }
    }
}

// helper functions for map
function mapSet<A, B>(f: (x: A) => B, xs: Set<A>): Set<B> {
    const s: Set<B> = new Set();
    for (const x of xs) {
        s.add(f(x));
    }
    return s;
}

function mapMap<A, B, K>(f: (x: A) => B, xs: Map<K, A>): Map<K, B> {
    const m: Map<K, B> = new Map();
    for (const [k, x] of xs.entries()) {
        m.set(k, f(x));
    }
    return m;
}

function mapRecord<A, B>(f: (x: A) => B, xs: ObjectMap<A>): ObjectMap<B> {
    const o: {[key: string]: B} = {};
    for (const [k, x] of Object.entries(xs)) {
        o[k] = f(x);
    }
    return o;
}

function* mapIterable<A, B>(f: (x: A) => B, xs: Iterable<A>): Iterable<B> {
    for (const x of xs) {
        yield f(x);
    }
}

/** generic implementation of bind */
export function bind<A, B>(f: (x: A) => Array<B>): (xs: Array<A>) => Array<B>;
export function bind<A, B>(f: (x: A) => Promise<B>): (xs: Promise<A>) => Promise<B>;
export function bind<A, B>(f: (x: A) => Set<B>): (xs: Set<A>) => Set<B>;
export function bind<A, B>(f: (x: A) => Iterable<B>): (xs: Iterable<A>) => Iterable<B>;
export function bind<A, B>(f: (x: A) => any): (xs: any) => any {
    return function (xs) {
        if (!xs) {
            throw new TypeError('invalid collection type');
        } else if (Array.isArray(xs)) {
            return xs.flatMap(f);
        } else if (xs instanceof Promise) {
            return xs.then(f);
        } else if (xs instanceof Set) {
            return bindSet(f, xs);
        } else if (isIterable(xs)) {
            return bindIterable(f, xs);
        } else {
            throw new TypeError('invalid collection type');
        }
    }
}

// helper functions for bind
function bindSet<A, B>(f: (x: A) => Set<B>, xs: Set<A>): Set<B> {
    const s: Set<B> = new Set();
    for (const x of xs) {
        const ys = f(x);
        for (const y of ys) {
            s.add(y);
        }
    }
    return s;
}

function* bindIterable<A, B>(f: (x: A) => Iterable<B>, xs: Iterable<A>): Iterable<B> {
    for (const x of xs) {
        yield* f(x);
    }
}

export function sort<T>(f: (a: T, b: T) => number): (xs: Array<T>|Iterable<T>) => Array<T> {
    return function (xs) {
        if (Array.isArray(xs)) {
            return xs.sort(f);
        } else if (isIterable(xs)) {
            return Array.from(xs).sort(f);
        } else {
            throw new TypeError('invalid collection type');
        }
    }
}

export function by<T>(f: (x: T) => number|string): (a: T, b: T) => number {
    return function (a, b) {
        const fa = f(a);
        const fb = f(b);
        if (fa < fb) {
            return -1;
        } else if (fa > fb) {
            return 1;
        } else {
            return 1;
        }
    }
}

export function foldl<A, B>(
    f: (a: B) => (x: A) => B,
    i: B
): (xs: Iterable<A>) => B {
    return function (xs) {
        let a = i;
        for (const x of xs) {
            a = f(a)(x);
        }
        return a;
    }
}

export function foldr<A, B>(
    f: (a: A) => (x: B) => B,
    i: B
): (xs: Iterable<A>) => B {
    return function (xs) {
        let a = i;
        for (const x of xs) {
            a = f(x)(a);
        }
        return a;
    }
}

export function insert<A>(x: A): {
    (xs: Array<A>): Array<A>,
    (xs: Set<A>): Set<A>,
};
export function insert<A>(x: [string, A]): {[key: string]: A};
export function insert<K, A>(x: [K, A]): Map<K, A>;
export function insert(x: any): any => any {
    return function (xs) {
        if (!xs) {
            throw new TypeError('invalid collection');
        } else if (Array.isArray(xs)) {
            xs.push(x);
            return xs;
        } else if (xs instanceof Set) {
            xs.add(x);
            return xs;
        } else if (xs instanceof Map) {
            xs.set(x[0], x[1];
            return xs;
        } else if (typeof xs === 'object') {
            xs[x[0]] = x[1];
            return xs;
        } else {
            throw new Typeof('invalid collection');
        }
    };
}