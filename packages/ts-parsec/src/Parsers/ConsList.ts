// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Token } from '../Lexer';

export interface ConsNode<T> {
    readonly value: T;
    readonly prev: ConsNode<T> | undefined;
}

export interface ConsStep<TKind, TResult> {
    readonly firstToken: Token<TKind> | undefined;
    readonly nextToken: Token<TKind> | undefined;
    readonly node: ConsNode<TResult> | undefined;
}

export function toArray<T>(node: ConsNode<T> | undefined): T[] {
    const out: T[] = [];
    let cur: ConsNode<T> | undefined = node;
    while (cur !== undefined) {
        out.push(cur.value);
        cur = cur.prev;
    }
    return out.reverse();
}
