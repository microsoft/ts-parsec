// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

// tslint:disable:no-duplicate-imports
// tslint:disable:trailing-comma

import * as assert from 'assert';
import * as parsec from 'typescript-parsec';
import { buildLexer, Token } from 'typescript-parsec';
import { amb, alt, apply, kright, rule, seq, str, tok } from 'typescript-parsec';

function notUndefined<T>(t: T | undefined): T {
    assert.notStrictEqual(t, undefined);
    return <T>t;
}

function succeeded<TKind, TResult>(r: parsec.ParserOutput<TKind, TResult>): parsec.ParseResult<TKind, TResult>[] {
    if (r.successful) {
        return r.candidates;
    }
    throw new Error(`The parsing does not succeed.`);
}

enum TokenKind {
    Number,
    Add,
    Space,
}

const lexer = buildLexer([
    [true, /^\d+/g, TokenKind.Number],
    [true, /^\+*/g, TokenKind.Add],
    [false, /^\s+/g, TokenKind.Space]
]);

var expr = rule<TokenKind, string>();
expr.setPattern(
    amb(
        alt(
            apply(tok(TokenKind.Number), (t: Token<TokenKind>) => t.text),
            apply(kright(str('+'), expr), (s: string) => `(+ ${s})`),
            apply(seq(expr, kright(str('+'), expr)), ([s, t]: [string, string]) => `(${s} + ${t})`),
            apply(seq(expr, expr), ([s, t]: [string, string]) => `(${s} . ${t})`)
        )
    )
);

test(`Parser: 1+2`, () => {
    const firstToken = notUndefined(lexer.parse(`1+2`));
    {
        const result = succeeded(expr.parse(firstToken));
        assert.strictEqual(result.length, 1);
        assert.deepStrictEqual(result[0].result, [
            '(1 + 2)',
            '(1 . (+ 2))',
        ]);
        assert.strictEqual(result[0].firstToken, firstToken);
        assert.strictEqual(result[0].nextToken, undefined);
    }
});
