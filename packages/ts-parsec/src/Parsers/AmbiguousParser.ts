// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

// tslint:disable:no-constant-condition
// tslint:disable:no-increment-decrement
// tslint:disable:prefer-for-of

import { Token } from '../Lexer';
import { apply } from './ApplyParser';
import { betterError, ParseError, Parser, ParseResult, ParserOutput, resultOrError } from './ParserInterface';
import { seq } from './SequencialParser';

export function amb<TKind, TResult>(p: Parser<TKind, TResult>): Parser<TKind, TResult[]> {
}