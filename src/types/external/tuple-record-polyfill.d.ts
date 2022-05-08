// Copyright (c) 2016-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

declare module '@bloomberg/record-tuple-polyfill' {
    export function Tuple(...xs: any[]): any[];
    export function Record(x: Record<any, any>): Record<any>;
}
