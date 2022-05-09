// Copyright (c) 2016-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
'use strict';

import {D, DR, DL, I} from 'common/utils/combinators';

const add = a => b => a+b;

describe('common/utils/combinators', () => {
    describe('DR', () => {
        it('should filter the second argument of a binary function', () => {
            expect(
                DR(add)(parseFloat)(1)('2')
            ).toBe(3);
        });
    });

    describe('DL', () => {
        it('should filter the first argument of a binary function', () => {
            expect(
                DL(add)(parseFloat)('1')(2)
            ).toBe(3);
        });
    });

    describe('D', () => {
        it('should filter both arguments of a binary function', () => {
            expect(D(add)(parseFloat, parseFloat)('1')('2')).toBe(3);
        });
    });

    describe('I', () => {
        it('should always return its first argument', () => {
            expect(I(1)).toBe(1);
            expect(I(null)).toBe(null);
            expect(I(1, null)).toBe(1);
        });
    });
});
