// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

// tslint:disable:no-null-keyword
// tslint:disable:no-any

import { lazy } from './LazyParser';
import type { Parser } from './ParserInterface';

export type ParserDefinition<TKind, TResult> = <
    TParserModule extends Record<string, (m: any) => Parser<TKind, TResult>>
>(
    m: {
        [K in keyof TParserModule]: Parser<TKind, TResult>;
    }
) => Parser<TKind, TResult>;

const defineReadOnly = <Target, Value>(
    target: Target,
    propName: string | number | symbol,
    value: Value
): Target & { readonly [name in typeof propName]: Value } =>
    <Target & { readonly [name in typeof propName]: Value }>Object.defineProperty(target, propName, {
        configurable: true,
        writable: false,
        enumerable: true,
        value
    });

export function makeParserModule<TKind, TResult>(
    definitions: Record<
        string,
        (
            m: {
                [K in keyof typeof definitions]: Parser<TKind, TResult>;
            }
        ) => Parser<TKind, TResult>
    >,
    entry: (
        m: {
            [K in keyof typeof definitions]: Parser<TKind, TResult>;
        }
    ) => Parser<TKind, TResult>
): Parser<TKind, TResult> {
    let parserModule = <{ [K in keyof typeof definitions]: Parser<TKind, TResult> }>Object.create(null);
    for (const [key, parserThunk] of Object.entries(definitions)) {
        parserModule = defineReadOnly(
            parserModule,
            key,
            lazy(() => parserThunk(parserModule))
        );
    }
    return entry(parserModule);
}
