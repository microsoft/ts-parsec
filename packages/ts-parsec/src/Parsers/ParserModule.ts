// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

// tslint:disable:no-null-keyword
// tslint:disable:no-any

import { lazy } from './LazyParser';
import type { Parser } from './ParserInterface';

const defineReadOnly = <Target, Value>(
  target: Target,
  propName: string | number | symbol,
  value: Value
): Target & { readonly [name in typeof propName]: Value } =>
  <Target & { readonly [name in typeof propName]: Value }>Object.defineProperty(
    target,
    propName,
    {
      configurable: true,
      writable: false,
      enumerable: true,
      value
    }
  );

export function makeParserModule<TKind, TResult>(
  definitions: Record<
    string,
    (
      m: {
        [K in keyof typeof definitions]: Parser<TKind, TResult>;
      }
    ) => Parser<TKind, TResult>
  >
): {
  [K in keyof typeof definitions]: ReturnType<typeof definitions[K]>;
} {
  let parserModule = <
    { [K in keyof typeof definitions]: ReturnType<typeof definitions[K]> }
  >Object.create(null);
  /*
   * building a module for the mutually dependent parsers
   * We use read-only to protect the module from being mutated by any definition.
   */
  for (const [key, parserThunk] of Object.entries(definitions)) {
    parserModule = defineReadOnly(
      parserModule,
      key,
      lazy(() => parserThunk(parserModule))
    );
  }
  return parserModule;
}
