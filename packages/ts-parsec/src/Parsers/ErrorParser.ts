// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Token } from '../Lexer';
import { Parser, ParserOutput } from './ParserInterface';

export function err<TKind, TResult>(p: Parser<TKind, TResult>, errorMessage: string): Parser<TKind, TResult> {
    return {
        parse(token: Token<TKind> | undefined): ParserOutput<TKind, TResult> {
            const branches = p.parse(token);
            if (branches.successful) {
                return branches;
            }

            return {
                successful: false,
                error: {
                    kind: 'Error',
                    pos: branches.error.pos,
                    message: errorMessage
                }
            };
        }
    };
}

export function errd<TKind, TResult>(p: Parser<TKind, TResult>, errorMessage: string, defaultValue: TResult): Parser<TKind, TResult> {
    return {
        parse(token: Token<TKind> | undefined): ParserOutput<TKind, TResult> {
            const branches = p.parse(token);
            if (branches.successful) {
                return branches;
            }

            return {
                successful: true,
                candidates: [{
                    firstToken: token,
                    nextToken: token,
                    result: defaultValue
                }],
                error: {
                    kind: 'Error',
                    pos: branches.error.pos,
                    message: errorMessage
                }
            };
        }
    };
}
