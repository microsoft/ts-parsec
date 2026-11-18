// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

// tslint:disable:max-classes-per-file
// tslint:disable:no-constant-condition
// tslint:disable:no-null-keyword

export interface TokenPosition {
    readonly index: number;
    readonly rowBegin: number;
    readonly columnBegin: number;
    readonly rowEnd: number;
    readonly columnEnd: number;
}

export interface Token<T> {
    readonly kind: T;
    readonly text: string;
    readonly pos: TokenPosition;
    readonly next: Token<T> | undefined;
}

export interface Lexer<T> {
    parse(input: string): Token<T> | undefined;
}

function posToString(pos: TokenPosition | undefined): string {
    return pos === undefined ? '<END-OF-FILE>' : JSON.stringify(pos);
}

export class TokenError extends Error {
    constructor(public pos: TokenPosition | undefined, public errorMessage: string) {
        super(`${posToString(pos)}: ${errorMessage}`);
    }
}

export class TokenRangeError extends Error {
    constructor(public first: TokenPosition | undefined, public next: TokenPosition | undefined, public errorMessage: string) {
        super(`${posToString(first)} - ${posToString(next)}: ${errorMessage}`);
    }
}

export function extractByPositionRange(input: string, first: TokenPosition | undefined, next: TokenPosition | undefined): string {
    const firstIndex = first === undefined ? input.length : first.index;
    const nextIndex = next === undefined ? input.length : next.index;
    if (firstIndex >= nextIndex) {
        return '';
    }
    return input.substring(firstIndex, nextIndex);
}

export function extractByTokenRange<T>(input: string, first: Token<T> | undefined, next: Token<T> | undefined): string {
    return extractByPositionRange(input, (first === undefined ? undefined : first.pos), (next === undefined ? undefined : next.pos));
}

class TokenImpl<T> implements Token<T> {
    private nextToken: Token<T> | undefined | null;

    constructor(
        private readonly lexer: LexerImpl<T>,
        private readonly input: string,
        public kind: T,
        public text: string,
        public pos: TokenPosition,
        public keep: boolean
    ) {
    }

    public get next(): Token<T> | undefined {
        if (this.nextToken === undefined) {
            this.nextToken = this.lexer.parseNextAvailable(
                this.input,
                this.pos.index + this.text.length,
                this.pos.rowEnd,
                this.pos.columnEnd
            );
            if (this.nextToken === undefined) {
                this.nextToken = null;
            }
        }

        return this.nextToken === null ? undefined : this.nextToken;
    }
}

export type LexerRule<T> = [boolean, RegExp, T, (LexerRule<T>[] | 'push' | 'pop')?];
export type LexerState<T> = LexerRule<T>[];

function analyzeLexerRules<T>(
    rules: LexerState<T>,
    memo: Set<LexerState<T>> = new Set(),
): void {
    memo.add(rules);
    for (const [, regex, , state] of rules) {
        if (regex.source[0] !== '^') {
            throw new Error(`Regular expression patterns for a tokenizer should start with '^': ${regex.source}`);
        }
        if (!regex.global) {
            throw new Error(`Regular expression patterns for a tokenizer should be global: ${regex.source}`);
        }
        if (state !== undefined) {
            if (state !== 'pop' && state !== 'push') {
                if (memo.has(state)) {
                    return;
                }
                analyzeLexerRules(state, memo);
            }
        }
    }
}

class LexerImpl<T> implements Lexer<T> {
    private states: LexerState<T>[] = [this.rules];

    constructor(public rules: LexerState<T>) {
        analyzeLexerRules(rules);
    }

    public parse(input: string): TokenImpl<T> | undefined {
        return this.parseNextAvailable(input, 0, 1, 1);
    }

    public parseNext(input: string, indexStart: number, rowBegin: number, columnBegin: number): TokenImpl<T> | undefined {
        if (indexStart === input.length) {
            return undefined;
        }

        const subString = input.substr(indexStart);
        let result: TokenImpl<T> | undefined;
        const currentRuleset = this.states[this.states.length - 1];
        let nextState: LexerState<T> | 'push' | 'pop' | undefined;
        for (const [keep, regexp, kind, next] of currentRuleset) {
            regexp.lastIndex = 0;
            if (regexp.test(subString)) {
                const text = subString.substr(0, regexp.lastIndex);
                let rowEnd = rowBegin;
                let columnEnd = columnBegin;
                for (const c of text) {
                    switch (c) {
                        case '\r': break;
                        case '\n': rowEnd++; columnEnd = 1; break;
                        default: columnEnd++;
                    }
                }

                const newResult = new TokenImpl<T>(this, input, kind, text, { index: indexStart, rowBegin, columnBegin, rowEnd, columnEnd }, keep);
                if (result === undefined || result.text.length < newResult.text.length) {
                    result = newResult;
                    nextState = next;
                }
            }
        }

        if (result === undefined) {
            throw new TokenError(
                { index: indexStart, rowBegin, columnBegin, rowEnd: rowBegin, columnEnd: columnBegin },
                `Unable to tokenize the rest of the input: ${input.substr(indexStart)}`
            );
        } else {
            if (nextState === 'pop') {
                this.states.pop();
            } else if (nextState === 'push') {
                this.states.push(currentRuleset);
            } else if (nextState !== undefined) {
                this.states.push(nextState);
            }
            return result;
        }
    }

    public parseNextAvailable(input: string, index: number, rowBegin: number, columnBegin: number): TokenImpl<T> | undefined {
        let token: TokenImpl<T> | undefined;
        while (true) {
            token = this.parseNext(
                input,
                (token === undefined ? index : token.pos.index + token.text.length),
                (token === undefined ? rowBegin : token.pos.rowEnd),
                (token === undefined ? columnBegin : token.pos.columnEnd)
            );
            if (token === undefined) {
                return undefined;
            } else if (token.keep) {
                return token;
            }
        }
    }
}

export function buildLexer<T>(rules: LexerState<T>): Lexer<T> {
    return new LexerImpl<T>(rules);
}

// TESTING

const statements: LexerState<string> = [];
const stringLiteral: LexerState<string> = [];

statements.push(
  [true, /^"/g, "stringDelimiter", stringLiteral],
);

stringLiteral.push(
  [true, /^\${/g, "stringInterpolationDelimiter", statements],
);

buildLexer(statements);
