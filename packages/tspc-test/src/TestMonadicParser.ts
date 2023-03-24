// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

// tslint:disable:no-duplicate-imports
// tslint:disable:trailing-comma

import * as assert from 'assert';
import * as parsec from 'typescript-parsec';
import { buildLexer, Token } from 'typescript-parsec';
import { apply, combine, fail, list_n, rule, str, tok } from 'typescript-parsec';

function notUndefined<T>(t: T | undefined): T {
    assert.notStrictEqual(t, undefined);
    return <T>t;
}

function succeeded<TKind, TResult>(r: parsec.ParserOutput<TKind, TResult>): parsec.ParseResult<TKind, TResult>[] {
    if (r.successful) {
        return r.candidates;
    }
    throw new Error(`The parsing does not succeed: ${r.error.message}`);
}

enum TokenKind {
    Number,
    Identifier,
    Comma,
    Space,
}

const lexer = buildLexer([
    [true, /^\d+/g, TokenKind.Number],
    [true, /^[a-zA-Z]\w*/g, TokenKind.Identifier],
    [true, /^,/g, TokenKind.Comma],
    [false, /^\s+/g, TokenKind.Space]
]);

const COUNT = rule<TokenKind, number>();
const NAME = rule<TokenKind, string>();
const NAME_LIST = rule<TokenKind, string[]>();

COUNT.setPattern(
    apply(
        tok(TokenKind.Number),
        (t: Token<TokenKind>) => +t.text
    )
);

NAME.setPattern(
    apply(
        tok(TokenKind.Identifier),
        (t: Token<TokenKind>) => t.text
    )
);

NAME_LIST.setPattern(
    combine(
        COUNT,
        (count: number) => {
            if (count < 1) {
                return fail<string[]>('The number of names must be at least 1.');
            } else {
                return list_n(NAME, str(','), count);
            }
        }
    )
);

test(`Parser: 0`, () => {
    const firstToken = notUndefined(lexer.parse(`0`));
    {
        const output = NAME_LIST.parse(firstToken);
        assert.strictEqual(output.successful, false);
        assert.strictEqual(output.error?.message, 'The number of names must be at least 1.');
    }
});

test(`Parser: 1 foo`, () => {
    const firstToken = notUndefined(lexer.parse(`1 foo`));
    {
        const result = succeeded(NAME.parse(firstToken));
        assert.strictEqual(result.length, 1);
        assert.strictEqual(result[0].result, ['foo']);
        assert.strictEqual(result[0].firstToken, firstToken);
        assert.strictEqual(result[0].nextToken, undefined);
    }
});

test(`Parser: 2 foo,bar`, () => {
    const firstToken = notUndefined(lexer.parse(`2 foo,bar`));
    {
        const result = succeeded(NAME.parse(firstToken));
        assert.strictEqual(result.length, 1);
        assert.strictEqual(result[0].result, ['foo', 'bar']);
        assert.strictEqual(result[0].firstToken, firstToken);
        assert.strictEqual(result[0].nextToken, undefined);
    }
});

test(`Parser: 3 foo,bar,baz`, () => {
    const firstToken = notUndefined(lexer.parse(`3 foo,bar,baz`));
    {
        const result = succeeded(NAME.parse(firstToken));
        assert.strictEqual(result.length, 1);
        assert.strictEqual(result[0].result, ['foo', 'bar', 'baz']);
        assert.strictEqual(result[0].firstToken, firstToken);
        assert.strictEqual(result[0].nextToken, undefined);
    }
});
