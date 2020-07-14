// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Parser } from './ParserInterface';

export function err<TKind, TResult>(p: Parser<TKind, TResult>, errorMessage: string): Parser<TKind, TResult> {
    throw new Error('Not implemented!');
}

export function errd<TKind, TResult>(p: Parser<TKind, TResult>, errorMessage: string, defaultValue: TResult): Parser<TKind, TResult> {
    throw new Error('Not implemented!');
}
