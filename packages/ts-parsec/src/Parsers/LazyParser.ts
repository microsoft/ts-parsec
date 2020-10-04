// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import type { Token } from '../Lexer';
import type { Parser, ParserOutput } from './ParserInterface';

export function lazy<TKind, TResult>(thunk: () => Parser<TKind, TResult>): Parser<TKind, TResult> {
    return {
        parse(token: Token<TKind> | undefined): ParserOutput<TKind, TResult> {
            return thunk().parse(token);
        }
    };
}
