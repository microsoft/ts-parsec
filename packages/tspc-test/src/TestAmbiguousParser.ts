// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

// tslint:disable:no-duplicate-imports
// tslint:disable:trailing-comma

import * as assert from 'assert';
import * as parsec from 'typescript-parsec';
import { buildLexer, Token } from 'typescript-parsec';
import { alt, amb, apply, kright, lrec_sc, rule, seq, str, tok } from 'typescript-parsec';

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

const term = rule<TokenKind, string>();
const expr = rule<TokenKind, string>();

term.setPattern(
    alt(
        apply(tok(TokenKind.Number), (t: Token<TokenKind>) => t.text),
        apply(kright(str('+'), expr), (s: string) => `(+ ${s})`)
    )
);

expr.setPattern(
    apply(
        amb(
            lrec_sc(
                term,
                alt(expr, seq(str('+'), expr)),
                (s: string, t: string | [Token<TokenKind>, string]) =>
                    typeof t === 'string'
                        ? `(${s} . ${t})`
                        : `(${s} + ${t[1]})`)
        ),
        (ss: string[]) => ss.length === 1 ? ss[0] : `[${ss.join(', ')}]`
    )
);

test(`Parser: 1`, () => {
    const firstToken = notUndefined(lexer.parse(`1`));
    {
        const result = succeeded(expr.parse(firstToken));
        assert.strictEqual(result.length, 1);
        assert.strictEqual(result[0].result, '1');
        assert.strictEqual(result[0].firstToken, firstToken);
        assert.strictEqual(result[0].nextToken, undefined);
    }
});

test(`Parser: +1`, () => {
    const firstToken = notUndefined(lexer.parse(`+1`));
    {
        const result = succeeded(expr.parse(firstToken));
        assert.strictEqual(result.length, 1);
        assert.strictEqual(result[0].result, '(+ 1)');
        assert.strictEqual(result[0].firstToken, firstToken);
        assert.strictEqual(result[0].nextToken, undefined);
    }
});

test(`Parser: 1+2`, () => {
    const firstToken = notUndefined(lexer.parse(`1+2`));
    {
        const result = succeeded(expr.parse(firstToken));
        assert.strictEqual(result.length, 1);
        assert.strictEqual(result[0].result, '[(1 . (+ 2)), (1 + 2)]');
        assert.strictEqual(result[0].firstToken, firstToken);
        assert.strictEqual(result[0].nextToken, undefined);
    }
});
