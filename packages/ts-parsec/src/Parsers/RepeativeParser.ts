// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

// tslint:disable:no-constant-condition
// tslint:disable:no-increment-decrement
// tslint:disable:prefer-for-of

import { Token } from '../Lexer';
import { apply, kright } from './ApplyParser';
import { betterError, ParseError, Parser, ParseResult, ParserOutput, resultOrError } from './ParserInterface';
import { seq } from './SequencialParser';
import { succ } from './TokenParser';

export function rep<TKind, TResult>(p: Parser<TKind, TResult>): Parser<TKind, TResult[]> {
    const reprParser = repr(p);
    return {
        parse(token: Token<TKind> | undefined): ParserOutput<TKind, TResult[]> {
            const output = reprParser.parse(token);
            if (output.successful) {
                return {
                    candidates: output.candidates.reverse(),
                    successful: true,
                    error: output.error
                };
            } else {
                return output;
            }
        }
    };
}

export function rep_sc<TKind, TResult>(p: Parser<TKind, TResult>): Parser<TKind, TResult[]> {
    return {
        parse(token: Token<TKind> | undefined): ParserOutput<TKind, TResult[]> {
            let error: ParseError | undefined;
            let result: ParseResult<TKind, TResult[]>[] = [{ firstToken: token, nextToken: token, result: [] }];

            while (true) {
                const steps = result;
                result = [];
                for (const step of steps) {
                    const output = p.parse(step.nextToken);
                    error = betterError(error, output.error);

                    if (output.successful) {
                        for (const candidate of output.candidates) {
                            if (candidate.nextToken !== step.nextToken) {
                                result.push({
                                    firstToken: step.firstToken,
                                    nextToken: candidate.nextToken,
                                    result: step.result.concat([candidate.result])
                                });
                            }
                        }
                    }
                }

                if (result.length === 0) {
                    result = steps;
                    break;
                }
            }
            return resultOrError(result, error, true);
        }
    };
}

export function repr<TKind, TResult>(p: Parser<TKind, TResult>): Parser<TKind, TResult[]> {
    return {
        parse(token: Token<TKind> | undefined): ParserOutput<TKind, TResult[]> {
            let error: ParseError | undefined;
            const result: ParseResult<TKind, TResult[]>[] = [{ firstToken: token, nextToken: token, result: [] }];

            for (let i = 0; i < result.length; i++) {
                const step = result[i];
                const output = p.parse(step.nextToken);
                error = betterError(error, output.error);

                if (output.successful) {
                    for (const candidate of output.candidates) {
                        if (candidate.nextToken !== step.nextToken) {
                            result.push({
                                firstToken: step.firstToken,
                                nextToken: candidate.nextToken,
                                result: step.result.concat([candidate.result])
                            });
                        }
                    }
                }
            }
            return resultOrError(result, error, true);
        }
    };
}

export function rep_n<TKind, TResult>(p: Parser<TKind, TResult>, count: number): Parser<TKind, TResult[]> {
    return {
        parse(token: Token<TKind> | undefined): ParserOutput<TKind, TResult[]> {
            let error: ParseError | undefined;
            let candidates: ParseResult<TKind, TResult[]>[] = [{ firstToken: token, nextToken: token, result: [] }];

            for (let i = 0; i < count; i++) {
                const newCandidates: ParseResult<TKind, TResult[]>[] = [];
                for (const step of candidates) {
                    const output = p.parse(step.nextToken);
                    error = betterError(error, output.error);
                    if (output.successful) {
                        for (const candidate of output.candidates) {
                            newCandidates.push({
                                firstToken: step.firstToken,
                                nextToken: candidate.nextToken,
                                result: step.result.concat([candidate.result])
                            });
                        }
                    }
                }

                if (newCandidates.length === 0) {
                    return {
                        successful: false,
                        error: <ParseError>error
                    };
                } else {
                    candidates = newCandidates;
                }
            }

            return resultOrError(candidates, error, true);
        }
    };
}

function applyList<TResult, TSeparator>([first, tail]: [TResult, TResult[]]): TResult[] {
    return [first, ...tail];
}

export function list<TKind, TResult, TSeparator>(p: Parser<TKind, TResult>, s: Parser<TKind, TSeparator>): Parser<TKind, TResult[]> {
    return apply(seq(p, rep(kright(s, p))), applyList);
}

export function list_sc<TKind, TResult, TSeparator>(p: Parser<TKind, TResult>, s: Parser<TKind, TSeparator>): Parser<TKind, TResult[]> {
    return apply(seq(p, rep_sc(kright(s, p))), applyList);
}

export function list_n<TKind, TResult, TSeparator>(p: Parser<TKind, TResult>, s: Parser<TKind, TSeparator>, count: number): Parser<TKind, TResult[]> {
    if (count < 1) {
        return succ<TKind, TResult[]>([]);
    } else if (count === 1) {
        return apply(p, (value: TResult) => [value]);
    } else {
        return apply(seq(p, rep_n(kright(s, p), count - 1)), applyList);
    }
}

function applyLrec<TResult, TFirst extends TResult, TSecond>(callback: (a: TResult, b: TSecond) => TResult): (value: [TFirst, TSecond[]]) => TResult {
    return (value: [TFirst, TSecond[]]): TResult => {
        let result: TResult = value[0];
        for (const tail of value[1]) {
            result = callback(result, tail);
        }
        return result;
    };
}

export function lrec<TKind, TResult, TFirst extends TResult, TSecond>(p: Parser<TKind, TFirst>, q: Parser<TKind, TSecond>, callback: (a: TResult, b: TSecond) => TResult): Parser<TKind, TResult> {
    return apply(seq(p, rep(q)), applyLrec(callback));
}

export function lrec_sc<TKind, TResult, TFirst extends TResult, TSecond>(p: Parser<TKind, TFirst>, q: Parser<TKind, TSecond>, callback: (a: TResult, b: TSecond) => TResult): Parser<TKind, TResult> {
    return apply(seq(p, rep_sc(q)), applyLrec(callback));
}
