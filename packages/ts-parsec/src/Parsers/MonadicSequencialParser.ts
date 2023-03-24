// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Token } from '../Lexer';
import { betterError, ParseError, Parser, ParseResult, ParserOutput, resultOrError } from './ParserInterface';

// CodegenOverloadings:Begin

export function combine<TKind, T1, T2>(
    p1: Parser<TKind, T1>,
    p2: (value : T1) => Parser<TKind, T2>
): Parser<TKind, T2>;

export function combine<TKind, T1, T2, T3>(
    p1: Parser<TKind, T1>,
    p2: (value : T1) => Parser<TKind, T2>,
    p3: (value : T2) => Parser<TKind, T3>
): Parser<TKind, T3>;

export function combine<TKind, T1, T2, T3, T4>(
    p1: Parser<TKind, T1>,
    p2: (value : T1) => Parser<TKind, T2>,
    p3: (value : T2) => Parser<TKind, T3>,
    p4: (value : T3) => Parser<TKind, T4>
): Parser<TKind, T4>;

export function combine<TKind, T1, T2, T3, T4, T5>(
    p1: Parser<TKind, T1>,
    p2: (value : T1) => Parser<TKind, T2>,
    p3: (value : T2) => Parser<TKind, T3>,
    p4: (value : T3) => Parser<TKind, T4>,
    p5: (value : T4) => Parser<TKind, T5>
): Parser<TKind, T5>;

export function combine<TKind, T1, T2, T3, T4, T5, T6>(
    p1: Parser<TKind, T1>,
    p2: (value : T1) => Parser<TKind, T2>,
    p3: (value : T2) => Parser<TKind, T3>,
    p4: (value : T3) => Parser<TKind, T4>,
    p5: (value : T4) => Parser<TKind, T5>,
    p6: (value : T5) => Parser<TKind, T6>
): Parser<TKind, T6>;

export function combine<TKind, T1, T2, T3, T4, T5, T6, T7>(
    p1: Parser<TKind, T1>,
    p2: (value : T1) => Parser<TKind, T2>,
    p3: (value : T2) => Parser<TKind, T3>,
    p4: (value : T3) => Parser<TKind, T4>,
    p5: (value : T4) => Parser<TKind, T5>,
    p6: (value : T5) => Parser<TKind, T6>,
    p7: (value : T6) => Parser<TKind, T7>
): Parser<TKind, T7>;

export function combine<TKind, T1, T2, T3, T4, T5, T6, T7, T8>(
    p1: Parser<TKind, T1>,
    p2: (value : T1) => Parser<TKind, T2>,
    p3: (value : T2) => Parser<TKind, T3>,
    p4: (value : T3) => Parser<TKind, T4>,
    p5: (value : T4) => Parser<TKind, T5>,
    p6: (value : T5) => Parser<TKind, T6>,
    p7: (value : T6) => Parser<TKind, T7>,
    p8: (value : T7) => Parser<TKind, T8>
): Parser<TKind, T8>;

export function combine<TKind, T1, T2, T3, T4, T5, T6, T7, T8, T9>(
    p1: Parser<TKind, T1>,
    p2: (value : T1) => Parser<TKind, T2>,
    p3: (value : T2) => Parser<TKind, T3>,
    p4: (value : T3) => Parser<TKind, T4>,
    p5: (value : T4) => Parser<TKind, T5>,
    p6: (value : T5) => Parser<TKind, T6>,
    p7: (value : T6) => Parser<TKind, T7>,
    p8: (value : T7) => Parser<TKind, T8>,
    p9: (value : T8) => Parser<TKind, T9>
): Parser<TKind, T9>;

export function combine<TKind, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>(
    p1: Parser<TKind, T1>,
    p2: (value : T1) => Parser<TKind, T2>,
    p3: (value : T2) => Parser<TKind, T3>,
    p4: (value : T3) => Parser<TKind, T4>,
    p5: (value : T4) => Parser<TKind, T5>,
    p6: (value : T5) => Parser<TKind, T6>,
    p7: (value : T6) => Parser<TKind, T7>,
    p8: (value : T7) => Parser<TKind, T8>,
    p9: (value : T8) => Parser<TKind, T9>,
    p10: (value : T9) => Parser<TKind, T10>
): Parser<TKind, T10>;

export function combine<TKind, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11>(
    p1: Parser<TKind, T1>,
    p2: (value : T1) => Parser<TKind, T2>,
    p3: (value : T2) => Parser<TKind, T3>,
    p4: (value : T3) => Parser<TKind, T4>,
    p5: (value : T4) => Parser<TKind, T5>,
    p6: (value : T5) => Parser<TKind, T6>,
    p7: (value : T6) => Parser<TKind, T7>,
    p8: (value : T7) => Parser<TKind, T8>,
    p9: (value : T8) => Parser<TKind, T9>,
    p10: (value : T9) => Parser<TKind, T10>,
    p11: (value : T10) => Parser<TKind, T11>
): Parser<TKind, T11>;

export function combine<TKind, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12>(
    p1: Parser<TKind, T1>,
    p2: (value : T1) => Parser<TKind, T2>,
    p3: (value : T2) => Parser<TKind, T3>,
    p4: (value : T3) => Parser<TKind, T4>,
    p5: (value : T4) => Parser<TKind, T5>,
    p6: (value : T5) => Parser<TKind, T6>,
    p7: (value : T6) => Parser<TKind, T7>,
    p8: (value : T7) => Parser<TKind, T8>,
    p9: (value : T8) => Parser<TKind, T9>,
    p10: (value : T9) => Parser<TKind, T10>,
    p11: (value : T10) => Parser<TKind, T11>,
    p12: (value : T11) => Parser<TKind, T12>
): Parser<TKind, T12>;

export function combine<TKind, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13>(
    p1: Parser<TKind, T1>,
    p2: (value : T1) => Parser<TKind, T2>,
    p3: (value : T2) => Parser<TKind, T3>,
    p4: (value : T3) => Parser<TKind, T4>,
    p5: (value : T4) => Parser<TKind, T5>,
    p6: (value : T5) => Parser<TKind, T6>,
    p7: (value : T6) => Parser<TKind, T7>,
    p8: (value : T7) => Parser<TKind, T8>,
    p9: (value : T8) => Parser<TKind, T9>,
    p10: (value : T9) => Parser<TKind, T10>,
    p11: (value : T10) => Parser<TKind, T11>,
    p12: (value : T11) => Parser<TKind, T12>,
    p13: (value : T12) => Parser<TKind, T13>
): Parser<TKind, T13>;

export function combine<TKind, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14>(
    p1: Parser<TKind, T1>,
    p2: (value : T1) => Parser<TKind, T2>,
    p3: (value : T2) => Parser<TKind, T3>,
    p4: (value : T3) => Parser<TKind, T4>,
    p5: (value : T4) => Parser<TKind, T5>,
    p6: (value : T5) => Parser<TKind, T6>,
    p7: (value : T6) => Parser<TKind, T7>,
    p8: (value : T7) => Parser<TKind, T8>,
    p9: (value : T8) => Parser<TKind, T9>,
    p10: (value : T9) => Parser<TKind, T10>,
    p11: (value : T10) => Parser<TKind, T11>,
    p12: (value : T11) => Parser<TKind, T12>,
    p13: (value : T12) => Parser<TKind, T13>,
    p14: (value : T13) => Parser<TKind, T14>
): Parser<TKind, T14>;

export function combine<TKind, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14, T15>(
    p1: Parser<TKind, T1>,
    p2: (value : T1) => Parser<TKind, T2>,
    p3: (value : T2) => Parser<TKind, T3>,
    p4: (value : T3) => Parser<TKind, T4>,
    p5: (value : T4) => Parser<TKind, T5>,
    p6: (value : T5) => Parser<TKind, T6>,
    p7: (value : T6) => Parser<TKind, T7>,
    p8: (value : T7) => Parser<TKind, T8>,
    p9: (value : T8) => Parser<TKind, T9>,
    p10: (value : T9) => Parser<TKind, T10>,
    p11: (value : T10) => Parser<TKind, T11>,
    p12: (value : T11) => Parser<TKind, T12>,
    p13: (value : T12) => Parser<TKind, T13>,
    p14: (value : T13) => Parser<TKind, T14>,
    p15: (value : T14) => Parser<TKind, T15>
): Parser<TKind, T15>;

export function combine<TKind, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14, T15, T16>(
    p1: Parser<TKind, T1>,
    p2: (value : T1) => Parser<TKind, T2>,
    p3: (value : T2) => Parser<TKind, T3>,
    p4: (value : T3) => Parser<TKind, T4>,
    p5: (value : T4) => Parser<TKind, T5>,
    p6: (value : T5) => Parser<TKind, T6>,
    p7: (value : T6) => Parser<TKind, T7>,
    p8: (value : T7) => Parser<TKind, T8>,
    p9: (value : T8) => Parser<TKind, T9>,
    p10: (value : T9) => Parser<TKind, T10>,
    p11: (value : T10) => Parser<TKind, T11>,
    p12: (value : T11) => Parser<TKind, T12>,
    p13: (value : T12) => Parser<TKind, T13>,
    p14: (value : T13) => Parser<TKind, T14>,
    p15: (value : T14) => Parser<TKind, T15>,
    p16: (value : T15) => Parser<TKind, T16>
): Parser<TKind, T16>;

// CodegenOverloadings:End

export function combine(first: Parser<void, {}>, continuations: ((_: {}) => Parser<void, {}>)[]): Parser<void, {}> {
    return {
        parse(token: Token<void> | undefined): ParserOutput<void, {}> {
            let output = first.parse(token);
            if (!output.successful) {
                return output;
            }

            let result: ParseResult<void, {}[]>[] = [{ firstToken: token, nextToken: token, result: [] }];
            let error = output.error;

            for (const c of continuations) {
                if (result.length === 0) {
                    break;
                }

                const steps = result;
                result = [];
                for (const step of steps) {
                    const output = c(step.result).parse(step.nextToken);
                    error = betterError(error, output.error);

                    if (output.successful) {
                        for (const candidate of output.candidates) {
                            result.push({
                                firstToken: step.firstToken,
                                nextToken: candidate.nextToken,
                                result: step.result.concat([candidate.result])
                            });
                        }
                    }
                }
            }
            return resultOrError(result, error, result.length !== 0);
        }
    };
}
