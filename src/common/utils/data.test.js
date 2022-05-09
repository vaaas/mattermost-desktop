// Copyright (c) 2016-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
'use strict';

import {isIterable, map, bind, sort, by, foldl, foldr} from 'common/utils/data';
import {DR, DL} from 'common/utils/combinators';

const add = a => b => a + b;
const second = x => x[1];

describe('common/utils/data', () => {
    describe('isIterable', () => {
        it('should return true on arrays', () => {
            expect(isIterable([])).toBe(true);
        });

        it('should return true on maps', () => {
            expect(isIterable(new Map([]))).toBe(true);
        });

        it('should return true on sets', () => {
            expect(isIterable(new Set([]))).toBe(true);
        })

        it('should return true on strings', () => {
            expect(isIterable('text')).toBe(true);
        });

        it('should return false on objects', () => {
            expect(isIterable({})).toBe(false);
        });

        it('should return true on generators', () => {
            const gen = (function* () {
                yield 1;
                yield 2;
            }());
            expect(isIterable(gen)).toBe(true);
        });

        it('should return false on null', () => {
            expect(isIterable(null)).toBe(false);
        });

        it('should return false on undefined', () => {
            expect(isIterable(undefined)).toBe(false);
        });
    });

    describe('sort', () => {
        it('should sort arrays', () => {
            const result = sort(by(x => x))([3,2,1]);
            expect(result).toHaveProperty('constructor', Array);
            expect(result).toHaveProperty('0', 1);
            expect(result).toHaveProperty('1', 2);
            expect(result).toHaveProperty('2', 3);
        });

        it('should sort arrays of objects', () => {
            const result = sort(by(x => x.value))([{value: 3}, {value: 2}, {value: 1}]);
            expect(result).toHaveProperty('constructor', Array);
            expect(result[0].value).toBe(1);
            expect(result[1].value).toBe(2);
            expect(result[2].value).toBe(3);
        });

        it('should sort iterables', () => {
            const result = sort(by(x => x))(new Set([3,2,1]));
            expect(result).toHaveProperty('constructor', Array);
            expect(result).toHaveProperty('0', 1);
            expect(result).toHaveProperty('1', 2);
            expect(result).toHaveProperty('2', 3);
        });
    });

    describe('map', () => {
        it('should map arrays', () => {
            const result = map(add(1))([1,2,3])
            expect(result).toHaveProperty('constructor', Array);
            expect(result).toHaveProperty('0', 2);
            expect(result).toHaveProperty('1', 3);
            expect(result).toHaveProperty('2', 4);
        });

        it('should map objects', () => {
            const result = map(add(1))({ 'Bob': 0, 'Alice': 1 })
            expect(result).toHaveProperty('constructor', Object);
            expect(result).toHaveProperty('Bob', 1);
            expect(result).toHaveProperty('Alice', 2);
        });

        it('should map sets', () => {
            const result = map(add(1))(new Set([1,2,3]))
            expect(result).toHaveProperty('constructor', Set)
            expect(result).toHaveProperty('size', 3);
            expect(result.has(2)).toBe(true);
            expect(result.has(3)).toBe(true);
            expect(result.has(4)).toBe(true);
        });

        it('should map maps', () => {
            const result = map(add(1))(new Map([['Bob', 0], ['Alice', 1]]));
            expect(result).toHaveProperty('constructor', Map);
            expect(result).toHaveProperty('size', 2);
            expect(result.get('Bob')).toBe(1);
            expect(result.get('Alice')).toBe(2);
        });

        it('should map generators', () => {
            const generator = (function* () {
                yield 1;
                yield 2;
                yield 3;
            }());
            const results = map(add(1))(generator);
            expect(results).toHaveProperty('constructor.constructor.name', 'GeneratorFunction');
            const arr_res = Array.from(results);
            expect(arr_res).toHaveProperty('0', 2);
            expect(arr_res).toHaveProperty('1', 3);
            expect(arr_res).toHaveProperty('2', 4);

        });

        it('should map promises', async () => {
            await expect(
                map(add(1))(Promise.resolve(1))
            ).resolves.toBe(2);
        });
    });

    describe('bind', () => {
        it('should bind arrays', () => {
            const results = bind(x => [x,x,x])([1])
            expect(results).toHaveProperty('constructor', Array);
            expect(results).toHaveProperty('0', 1);
            expect(results).toHaveProperty('1', 1);
            expect(results).toHaveProperty('2', 1);
        });

        it('should bind promises', async () => {
            await expect(
                bind(x => x+1)(Promise.resolve(1))
            ).resolves.toBe(2);
        });

        it('should bind iterables', () => {
            const gen = (function* () {
                yield 1;
            }());
            const result = bind(x => [x, x, x])(gen);
            expect(result).toHaveProperty('constructor.constructor.name', 'GeneratorFunction');
            const arr_res = Array.from(result);
            expect(arr_res).toHaveProperty('0', 1);
            expect(arr_res).toHaveProperty('1', 1);
            expect(arr_res).toHaveProperty('2', 1);
        });

        it('should bind sets', () => {
            const result = bind(x => [x, x+1, x])(new Set([1]));
            expect(result).toHaveProperty('constructor', Set)
            expect(result).toHaveProperty('size', 2);
            expect(result.has(1)).toBe(true);
            expect(result.has(2)).toBe(true);
        });
    });

    describe('foldl', () => {
        it('should foldl arrays', () => {
            expect(foldl(add, 0)([1,2,3])).toBe(6);
        });

        it('should foldl sets', () => {
            expect(foldl(add, 0)(new Set([1,2,3]))).toBe(6);
        });

        it('should foldl maps', () => {
            expect(
                foldl(DR(add)(second), 0)(new Map([['Bob', 1], ['Alice', 2], ['Priscilla', 3]]))
            ).toBe(6);
        });

        it('should foldl strings', () => {
            expect(
                foldl(DR(add)(parseFloat), 0)('123')
            ).toBe(6);
        });

        it('should foldl generators', () => {
            const generator = (function* () {
                yield 1;
                yield 2;
                yield 3;
            }());

            expect(foldl(add, 0)(generator)).toBe(6);
        });
    });

    describe('foldr', () => {
        it('should foldr arrays', () => {
            expect(foldr(add, 0)([1,2,3])).toBe(6);
        });

        it('should foldr sets', () => {
            expect(foldr(add, 0)(new Set([1,2,3]))).toBe(6);
        });

        it('should foldr maps', () => {
            expect(
                foldr(DL(add)(second), 0)(new Map([['Bob', 1], ['Alice', 2], ['Priscilla', 3]]))
            ).toBe(6);
        });

        it('should foldr strings', () => {
            expect(
                foldr(DL(add)(parseFloat), 0)('123')
            ).toBe(6);
        });

        it('should foldr generators', () => {
            const generator = (function* () {
                yield 1;
                yield 2;
                yield 3;
            }());

            expect(foldr(add, 0)(generator)).toBe(6);
        });
    });
});