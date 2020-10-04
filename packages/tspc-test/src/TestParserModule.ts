// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

// tslint:disable:no-duplicate-imports
// tslint:disable:trailing-comma
// tslint:disable:function-name

import * as assert from 'assert';
import { Parser, Token } from 'typescript-parsec';
import { buildLexer, expectEOF, expectSingleResult } from 'typescript-parsec';
import { alt, apply, kmid, lrec_sc, makeParserModule, seq, str, tok } from 'typescript-parsec';

enum TokenKind {
    Number,
    Add,
    Sub,
    Mul,
    Div,
    LParen,
    RParen,
    Space
}

const lexer = buildLexer([
    [true, /^\d+(\.\d+)?/g, TokenKind.Number],
    [true, /^\+/g, TokenKind.Add],
    [true, /^\-/g, TokenKind.Sub],
    [true, /^\*/g, TokenKind.Mul],
    [true, /^\//g, TokenKind.Div],
    [true, /^\(/g, TokenKind.LParen],
    [true, /^\)/g, TokenKind.RParen],
    [false, /^\s+/g, TokenKind.Space]
]);

function applyNumber(value: Token<TokenKind.Number>): number {
    return +value.text;
}

function applyUnary(value: [Token<TokenKind>, number]): number {
    switch (value[0].text) {
        case '+':
            return +value[1];
        case '-':
            return -value[1];
        default:
            throw new Error(`Unknown unary operator: ${value[0].text}`);
    }
}

function applyBinary(first: number, second: [Token<TokenKind>, number]): number {
    switch (second[0].text) {
        case '+':
            return first + second[1];
        case '-':
            return first - second[1];
        case '*':
            return first * second[1];
        case '/':
            return first / second[1];
        default:
            throw new Error(`Unknown binary operator: ${second[0].text}`);
    }
}

const parserModule = makeParserModule(
    {
        /*
         * TERM
         *  = NUMBER
         *  = ('+' | '-') TERM
         *  = '(' EXP ')'
         */
        TERM(m: { TERM: Parser<TokenKind, number>; EXP: Parser<TokenKind, number> }): Parser<TokenKind, number> {
            return alt(
                apply(tok(TokenKind.Number), applyNumber),
                apply(seq(alt(str('+'), str('-')), m.TERM), applyUnary),
                kmid(str('('), m.EXP, str(')'))
            );
        },
        /*
         * FACTOR
         *  = TERM
         *  = FACTOR ('*' | '/') TERM
         */
        FACTOR(m: { TERM: Parser<TokenKind, number> }): Parser<TokenKind, number> {
            return lrec_sc(m.TERM, seq(alt(str('*'), str('/')), m.TERM), applyBinary);
        },
        /*
         *EXP
         *  = FACTOR
         *  = EXP ('+' | '-') FACTOR
         */
        EXP(m: { FACTOR: Parser<TokenKind, number> }): Parser<TokenKind, number> {
            return lrec_sc(m.FACTOR, seq(alt(str('+'), str('-')), m.FACTOR), applyBinary);
        }
    },
    (m: { EXP: Parser<TokenKind, number> }): Parser<TokenKind, number> => m.EXP
);

function evaluate(expr: string): number {
    return expectSingleResult(expectEOF(parserModule.parse(lexer.parse(expr))));
}

test(`Parser: calculator`, () => {
    assert.strictEqual(evaluate('1'), 1);
    assert.strictEqual(evaluate('+1.5'), 1.5);
    assert.strictEqual(evaluate('-0.5'), -0.5);
    assert.strictEqual(evaluate('1 + 2'), 3);
    assert.strictEqual(evaluate('1 - 2'), -1);
    assert.strictEqual(evaluate('1 * 2'), 2);
    assert.strictEqual(evaluate('1 / 2'), 0.5);
    assert.strictEqual(evaluate('1 + 2 * 3 + 4'), 11);
    assert.strictEqual(evaluate('(1 + 2) * (3 + 4)'), 21);
    assert.strictEqual(evaluate('1.2--3.4'), 4.6);
});
