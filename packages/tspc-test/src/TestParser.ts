// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

// tslint:disable:no-duplicate-imports
// tslint:disable:trailing-comma

import * as assert from 'assert';
import * as parsec from 'typescript-parsec';
import { buildLexer, Token } from 'typescript-parsec';
import { alt, alt_sc, apply, errd, kleft, kmid, kright, opt, opt_sc, rep, rep_n, rep_sc, repr, seq, str, tok } from 'typescript-parsec';

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
    Identifier,
    Comma,
    Space,
}

const lexer = buildLexer([
    [true, /^\d+/g, TokenKind.Number],
    [true, /^[a-zA-Z]\w*/g, TokenKind.Identifier],
    [false, /^,/g, TokenKind.Comma],
    [false, /^\s+/g, TokenKind.Space]
]);

test(`Parser: str`, () => {
    const firstToken = notUndefined(lexer.parse(`123,456`));
    {
        const result = succeeded(str('123').parse(firstToken));
        assert.strictEqual(result.length, 1);
        assert.strictEqual(result[0].result.text, '123');
        assert.strictEqual(result[0].firstToken, firstToken);
        assert.strictEqual(result[0].nextToken, firstToken.next);
    }
    {
        const result = str('456').parse(firstToken);
        assert.strictEqual(result.successful, false);
    }
});

test(`Parser: tok`, () => {
    const firstToken = notUndefined(lexer.parse(`123,456`));
    {
        const result = succeeded(tok(TokenKind.Number).parse(firstToken));
        assert.strictEqual(result.length, 1);
        assert.strictEqual(result[0].result.text, '123');
        assert.strictEqual(result[0].firstToken, firstToken);
        assert.strictEqual(result[0].nextToken, firstToken.next);
    }
    {
        const result = str('456').parse(firstToken);
        assert.strictEqual(result.successful, false);
    }
});

test(`Parser: alt`, () => {
    {
        const firstToken = notUndefined(lexer.parse(`123,456`));
        const result = succeeded(alt(tok(TokenKind.Number), tok(TokenKind.Identifier)).parse(firstToken));
        assert.strictEqual(result.length, 1);
        assert.strictEqual(result[0].result.text, '123');
        assert.strictEqual(result[0].firstToken, firstToken);
        assert.strictEqual(result[0].nextToken, firstToken.next);
    }
    {
        const firstToken = notUndefined(lexer.parse(`abc,def`));
        const result = succeeded(alt(tok(TokenKind.Number), tok(TokenKind.Identifier)).parse(firstToken));
        assert.strictEqual(result.length, 1);
        assert.strictEqual(result[0].result.text, 'abc');
        assert.strictEqual(result[0].firstToken, firstToken);
        assert.strictEqual(result[0].nextToken, firstToken.next);
    }
    {
        const firstToken = notUndefined(lexer.parse(`123,456`));
        const alt1 = alt(tok(TokenKind.Number), tok(TokenKind.Identifier));
        const alt2 = alt(tok(TokenKind.Identifier), tok(TokenKind.Number));
        const result = succeeded(alt(alt1, alt2).parse(firstToken));
        assert.strictEqual(result.length, 2);
        assert.strictEqual(result[0].result.text, '123');
        assert.strictEqual(result[0].firstToken, firstToken);
        assert.strictEqual(result[0].nextToken, firstToken.next);
        assert.strictEqual(result[1].result.text, '123');
        assert.strictEqual(result[1].firstToken, firstToken);
        assert.strictEqual(result[1].nextToken, firstToken.next);
    }
    {
        const firstToken = notUndefined(lexer.parse(`abc,def`));
        const alt1 = alt(tok(TokenKind.Number), tok(TokenKind.Identifier));
        const alt2 = alt(tok(TokenKind.Identifier), tok(TokenKind.Number));
        const result = succeeded(alt(alt1, alt2).parse(firstToken));
        assert.strictEqual(result.length, 2);
        assert.strictEqual(result[0].result.text, 'abc');
        assert.strictEqual(result[0].firstToken, firstToken);
        assert.strictEqual(result[0].nextToken, firstToken.next);
        assert.strictEqual(result[1].result.text, 'abc');
        assert.strictEqual(result[1].firstToken, firstToken);
        assert.strictEqual(result[1].nextToken, firstToken.next);
    }
});

test(`Parser: alt_sc`, () => {
    {
        const firstToken = notUndefined(lexer.parse(`123,456`));
        const result = succeeded(alt_sc(tok(TokenKind.Number), tok(TokenKind.Identifier)).parse(firstToken));
        assert.strictEqual(result.length, 1);
        assert.strictEqual(result[0].result.text, '123');
        assert.strictEqual(result[0].firstToken, firstToken);
        assert.strictEqual(result[0].nextToken, firstToken.next);
    }
    {
        const firstToken = notUndefined(lexer.parse(`abc,def`));
        const result = succeeded(alt_sc(tok(TokenKind.Number), tok(TokenKind.Identifier)).parse(firstToken));
        assert.strictEqual(result.length, 1);
        assert.strictEqual(result[0].result.text, 'abc');
        assert.strictEqual(result[0].firstToken, firstToken);
        assert.strictEqual(result[0].nextToken, firstToken.next);
    }
    {
        const firstToken = notUndefined(lexer.parse(`123,456`));
        {
            const alt1 = apply(alt(tok(TokenKind.Number), tok(TokenKind.Identifier)), (value: Token<TokenKind>) => `alt1: ${value.text}`);
            const alt2 = apply(alt(tok(TokenKind.Identifier), tok(TokenKind.Number)), (value: Token<TokenKind>) => `alt2: ${value.text}`);
            const result = succeeded(alt_sc(alt1, alt2).parse(firstToken));
            assert.strictEqual(result.length, 1);
            assert.strictEqual(result[0].result, 'alt1: 123');
            assert.strictEqual(result[0].firstToken, firstToken);
            assert.strictEqual(result[0].nextToken, firstToken.next);
        }
        {
            const alt1 = apply(tok(TokenKind.Identifier), (value: Token<TokenKind>) => `alt1: ${value.text}`);
            const alt2 = apply(alt(tok(TokenKind.Identifier), tok(TokenKind.Number)), (value: Token<TokenKind>) => `alt2: ${value.text}`);
            const result = succeeded(alt_sc(alt1, alt2).parse(firstToken));
            assert.strictEqual(result.length, 1);
            assert.strictEqual(result[0].result, 'alt2: 123');
            assert.strictEqual(result[0].firstToken, firstToken);
            assert.strictEqual(result[0].nextToken, firstToken.next);
        }
    }
    {
        const firstToken = notUndefined(lexer.parse(`abc,def`));
        {
            const alt1 = apply(alt(tok(TokenKind.Number), tok(TokenKind.Identifier)), (value: Token<TokenKind>) => `alt1: ${value.text}`);
            const alt2 = apply(alt(tok(TokenKind.Identifier), tok(TokenKind.Number)), (value: Token<TokenKind>) => `alt2: ${value.text}`);
            const result = succeeded(alt_sc(alt1, alt2).parse(firstToken));
            assert.strictEqual(result.length, 1);
            assert.strictEqual(result[0].result, 'alt1: abc');
            assert.strictEqual(result[0].firstToken, firstToken);
            assert.strictEqual(result[0].nextToken, firstToken.next);
        }
        {
            const alt1 = apply(tok(TokenKind.Number), (value: Token<TokenKind>) => `alt1: ${value.text}`);
            const alt2 = apply(alt(tok(TokenKind.Identifier), tok(TokenKind.Number)), (value: Token<TokenKind>) => `alt2: ${value.text}`);
            const result = succeeded(alt_sc(alt1, alt2).parse(firstToken));
            assert.strictEqual(result.length, 1);
            assert.strictEqual(result[0].result, 'alt2: abc');
            assert.strictEqual(result[0].firstToken, firstToken);
            assert.strictEqual(result[0].nextToken, firstToken.next);
        }
    }
});

test(`Parser: seq`, () => {
    const firstToken = notUndefined(lexer.parse(`123,456`));
    {
        const result = seq(tok(TokenKind.Number), tok(TokenKind.Identifier)).parse(firstToken);
        assert.strictEqual(result.successful, false);
    }
    {
        const result = succeeded(seq(tok(TokenKind.Number), tok(TokenKind.Number)).parse(firstToken));
        assert.strictEqual(result.length, 1);
        assert.deepStrictEqual(result[0].result.map((value: Token<TokenKind>) => value.text), ['123', '456']);
        assert.strictEqual(result[0].firstToken, firstToken);
        assert.strictEqual(result[0].nextToken, undefined);
    }
});

test(`Parser: kleft, kmid, kright`, () => {
    const firstToken = notUndefined(lexer.parse(`123,456,789`));
    {
        const result = succeeded(kleft(tok(TokenKind.Number), seq(tok(TokenKind.Number), tok(TokenKind.Number))).parse(firstToken));
        assert.strictEqual(result.length, 1);
        assert.strictEqual(result[0].result.text, '123');
        assert.strictEqual(result[0].firstToken, firstToken);
        assert.strictEqual(result[0].nextToken, undefined);
    }
    {
        const result = succeeded(kmid(tok(TokenKind.Number), tok(TokenKind.Number), tok(TokenKind.Number)).parse(firstToken));
        assert.strictEqual(result.length, 1);
        assert.strictEqual(result[0].result.text, '456');
        assert.strictEqual(result[0].firstToken, firstToken);
        assert.strictEqual(result[0].nextToken, undefined);
    }
    {
        const result = succeeded(kright(tok(TokenKind.Number), seq(tok(TokenKind.Number), tok(TokenKind.Number))).parse(firstToken));
        assert.strictEqual(result.length, 1);
        assert.deepStrictEqual(result[0].result.map((value: Token<TokenKind>) => value.text), ['456', '789']);
        assert.strictEqual(result[0].firstToken, firstToken);
        assert.strictEqual(result[0].nextToken, undefined);
    }
});

test(`Parser: opt`, () => {
    const firstToken = notUndefined(lexer.parse(`123,456`));
    {
        const result = succeeded(opt(tok(TokenKind.Number)).parse(firstToken));
        assert.strictEqual(result.length, 2);
        assert.strictEqual((<Token<TokenKind>>result[0].result).text, '123');
        assert.strictEqual(result[0].firstToken, firstToken);
        assert.strictEqual(result[0].nextToken, firstToken.next);
        assert.strictEqual(result[1].result, undefined);
        assert.strictEqual(result[1].firstToken, firstToken);
        assert.strictEqual(result[1].nextToken, firstToken);
    }
});

test(`Parser: opt_sc`, () => {
    const firstToken = notUndefined(lexer.parse(`123,456`));
    {
        const result = succeeded(opt_sc(tok(TokenKind.Number)).parse(firstToken));
        assert.strictEqual(result.length, 1);
        assert.strictEqual((<Token<TokenKind>>result[0].result).text, '123');
        assert.strictEqual(result[0].firstToken, firstToken);
        assert.strictEqual(result[0].nextToken, firstToken.next);
    }
    {
        const result = succeeded(opt_sc(tok(TokenKind.Identifier)).parse(firstToken));
        assert.strictEqual(result.length, 1);
        assert.strictEqual(result[0].result, undefined);
        assert.strictEqual(result[0].firstToken, firstToken);
        assert.strictEqual(result[0].nextToken, firstToken);
    }
});

test(`Parser: rep_sc`, () => {
    const firstToken = notUndefined(lexer.parse(`123,456`));
    {
        const result = succeeded(rep_sc(tok(TokenKind.Number)).parse(firstToken));
        assert.strictEqual(result.length, 1);
        assert.deepStrictEqual(result[0].result.map((value: Token<TokenKind>) => value.text), ['123', '456']);
        assert.strictEqual(result[0].firstToken, firstToken);
        assert.strictEqual(result[0].nextToken, undefined);
    }
    {
        const result = succeeded(rep_sc(tok(TokenKind.Identifier)).parse(firstToken));
        assert.strictEqual(result.length, 1);
        assert.deepStrictEqual(result[0].result.map((value: Token<TokenKind>) => value.text), []);
        assert.strictEqual(result[0].firstToken, firstToken);
        assert.strictEqual(result[0].nextToken, firstToken);
    }
});

test(`Parser: repr`, () => {
    const firstToken = notUndefined(lexer.parse(`123,456`));
    {
        const result = succeeded(repr(tok(TokenKind.Number)).parse(firstToken));
        assert.strictEqual(result.length, 3);
        assert.deepStrictEqual(result[0].result, []);
        assert.strictEqual(result[0].firstToken, firstToken);
        assert.strictEqual(result[0].nextToken, firstToken);
        assert.deepStrictEqual(result[1].result.map((value: Token<TokenKind>) => value.text), ['123']);
        assert.strictEqual(result[1].firstToken, firstToken);
        assert.strictEqual(result[1].nextToken, firstToken.next);
        assert.deepStrictEqual(result[2].result.map((value: Token<TokenKind>) => value.text), ['123', '456']);
        assert.strictEqual(result[2].firstToken, firstToken);
        assert.strictEqual(result[2].nextToken, undefined);
    }
});

test(`Parser: rep`, () => {
    const firstToken = notUndefined(lexer.parse(`123,456`));
    {
        const result = succeeded(rep(tok(TokenKind.Number)).parse(firstToken));
        assert.strictEqual(result.length, 3);
        assert.deepStrictEqual(result[0].result.map((value: Token<TokenKind>) => value.text), ['123', '456']);
        assert.strictEqual(result[0].firstToken, firstToken);
        assert.strictEqual(result[0].nextToken, undefined);
        assert.deepStrictEqual(result[1].result.map((value: Token<TokenKind>) => value.text), ['123']);
        assert.strictEqual(result[1].firstToken, firstToken);
        assert.strictEqual(result[1].nextToken, firstToken.next);
        assert.deepStrictEqual(result[2].result, []);
        assert.strictEqual(result[2].firstToken, firstToken);
        assert.strictEqual(result[2].nextToken, firstToken);
    }
});

test(`Parser: rep_n`, () => {
    const firstToken = notUndefined(lexer.parse(`123,456,789`));
    {
        const result = succeeded(rep_n(tok(TokenKind.Number), 0).parse(firstToken));
        assert.strictEqual(result.length, 1);
        assert.deepStrictEqual(result[0].result.length, 0);
        assert.strictEqual(result[0].firstToken, firstToken);
        assert.strictEqual(result[0].nextToken, firstToken);
    }
    {
        const result = succeeded(rep_n(tok(TokenKind.Number), 1).parse(firstToken));
        assert.strictEqual(result.length, 1);
        assert.deepStrictEqual(result[0].result.map((value: Token<TokenKind>) => value.text), ['123']);
        assert.strictEqual(result[0].firstToken, firstToken);
        assert.strictEqual(result[0].nextToken?.text, '456');
    }
    {
        const result = succeeded(rep_n(tok(TokenKind.Number), 2).parse(firstToken));
        assert.strictEqual(result.length, 1);
        assert.deepStrictEqual(result[0].result.map((value: Token<TokenKind>) => value.text), ['123', '456']);
        assert.strictEqual(result[0].firstToken, firstToken);
        assert.strictEqual(result[0].nextToken?.text, '789');
    }
    {
        const result = succeeded(rep_n(tok(TokenKind.Number), 3).parse(firstToken));
        assert.strictEqual(result.length, 1);
        assert.deepStrictEqual(result[0].result.map((value: Token<TokenKind>) => value.text), ['123', '456', '789']);
        assert.strictEqual(result[0].firstToken, firstToken);
        assert.strictEqual(result[0].nextToken, undefined);
    }
    {
        const output = rep_n(tok(TokenKind.Number), 4).parse(firstToken);
        assert.strictEqual(output.successful, false);
    }
});

test(`Parser: apply`, () => {
    const firstToken = notUndefined(lexer.parse(`123,456`));
    {
        const result = succeeded(
            apply(
                repr(tok(TokenKind.Number)),
                (values: Token<TokenKind>[]) => {
                    return values.map((value: Token<TokenKind>) => {
                        return value.text;
                    }).join(';');
                }
            ).parse(firstToken)
        );
        assert.strictEqual(result.length, 3);
        assert.strictEqual(result[0].result, '');
        assert.strictEqual(result[0].firstToken, firstToken);
        assert.strictEqual(result[0].nextToken, firstToken);
        assert.strictEqual(result[1].result, '123');
        assert.strictEqual(result[1].firstToken, firstToken);
        assert.strictEqual(result[1].nextToken, firstToken.next);
        assert.strictEqual(result[2].result, '123;456');
        assert.strictEqual(result[2].firstToken, firstToken);
        assert.strictEqual(result[2].nextToken, undefined);
    }
});

test(`Parser: errd`, () => {
    const firstToken = notUndefined(lexer.parse(`a`));
    {
        const result =
            errd(
                apply(
                    tok(TokenKind.Number),
                    (value: Token<TokenKind>) => +value.text
                ),
                'This is not a number!',
                1024
            ).parse(firstToken);

        assert.strictEqual(result.successful, true);
        if (result.successful) {
            assert.strictEqual(result.candidates.length, 1);
            assert.strictEqual(result.candidates[0].result, 1024);
            assert.strictEqual(result.candidates[0].firstToken, firstToken);
            assert.strictEqual(result.candidates[0].nextToken, firstToken);
            assert.deepStrictEqual(result.error, {
                kind: 'Error',
                pos: firstToken.pos,
                message: 'This is not a number!'
            });
        }
    }
});
