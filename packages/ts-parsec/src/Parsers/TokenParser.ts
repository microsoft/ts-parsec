// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Token } from '../Lexer';
import { FailedParser, FailedParserOutput, Parser, ParserOutput, unableToConsumeToken } from './ParserInterface';

export function nil<T>(): Parser<T, undefined> {
    return {
        parse(token: Token<T> | undefined): ParserOutput<T, undefined> {
            return {
                candidates: [{
                    firstToken: token,
                    nextToken: token,
                    result: undefined
                }],
                successful: true,
                error: undefined
            };
        }
    };
}

export function succ<T, R>(value: R): Parser<T, R> {
    return {
        parse(token: Token<T> | undefined): ParserOutput<T, R> {
            return {
                candidates: [{
                    firstToken: token,
                    nextToken: token,
                    result: value
                }],
                successful: true,
                error: undefined
            };
        }
    };
}

export function fail<R>(errorMessage: string): FailedParser<R> {
    return {
        parse(token: Token<unknown> | undefined): FailedParserOutput<R> {
            return {
                successful: false,
                error: {
                    kind: 'Error',
                    pos: token?.pos,
                    message: errorMessage
                }
            };
        }
    };
}

export function str<T>(toMatch: string): Parser<T, Token<T>> {
    return {
        parse(token: Token<T> | undefined): ParserOutput<T, Token<T>> {
            if (token === undefined || token.text !== toMatch) {
                return {
                    successful: false,
                    error: unableToConsumeToken(token)
                };
            }
            return {
                candidates: [{
                    firstToken: token,
                    nextToken: token.next,
                    result: token
                }],
                successful: true,
                error: undefined
            };
        }
    };
}

export function tok<T>(toMatch: T): Parser<T, Token<T>> {
    return {
        parse(token: Token<T> | undefined): ParserOutput<T, Token<T>> {
            if (token === undefined || token.kind !== toMatch) {
                return {
                    successful: false,
                    error: unableToConsumeToken(token)
                };
            }
            return {
                candidates: [{
                    firstToken: token,
                    nextToken: token.next,
                    result: token
                }],
                successful: true,
                error: undefined
            };
        }
    };
}
