# typescript-parsec Document

ts-parsec is a parser combinator library prepared for typescript. By using this library, you are able to create parsers very quickly using just a few lines of code. It provides the following features:

- **Tokenizer based on regular expressions**. This tokenizer is designed for convenience. For some cases its performance may be unsatisfying. In this case, you could write your own tokenizer. It is very easy to plug your tokenizer into ts-parsec.
- **Parser combinators**.
- The ability to support recursive syntax.

You are recommended to learn [EBNF](https://en.wikipedia.org/wiki/Extended_Backus%E2%80%93Naur_form) before using this library.

## Getting Started

[Getting Started](./GettingStarted.md).

## Design of this Library

typescript-parsec does not force you to create ASTs for their input. Instead, it gives you a data structure that looks similar to the grammar.
For example, given the grammar:

```EBNF
A B (C|D) {E F, ...} G
```

By using this library, you could write the parser using combinators `seq`, `alt` and `list_sc` in this way:

```typescript
const myParser = seq(A, B, alt(C, D), list_sc(seq(E, F), str(',')), G);
```

Usually, if you are very sure that the input should not have ambiguity, and you want to parse the whole input instead of just a prefix, you could use utility functions to make your life easier:

```typescript
const output = expectSingleResult(expectEOF(myParser.parse(myTokenizer.parse(`INPUT`))));
```

If parser `A` converts inputs to values of type `TA`, then the type of variable `output` is `[TA, TB, (TC | TD), [TE, TF][], TG]`.
It is very obvious that, `alt(C, D)` gives you `TC | TD`, because either `C` or `D` will success, and you will get `TC` or `TD` in different moments.
`list_sc(seq(E, F), str(','))` gives you `seq(E, F)` as many as possible, so you gete `[TE, TF][]`.
The whole parser assume that the input has 5 parts: `A`, `B`, `alt(C, D)`, `list_sc(seq(E, F), str(','))` and `G`,
so you get `[TA, TB, (TC | TD), [TE, TF][], TG]`.

In most of the cases, you want to convert data structures to your own data structures, you could write:

```typescript
function convertToSomething(value: [TA, TB, (TC | TD), [TE, TF][], TG]): Something {
    ...
}

const myParser =
    apply(
        seq(A, B, alt(C, D), list_sc(seq(E, F), str(',')), G),
        convertToSomething
    );
const output = expectSingleResult(expectEOF(myParser.parse(myTokenizer.parse(`INPUT`))));
```

Now `output` becomes `Something`.

When you have a complex grammar, you are recommended to use `apply` everywhere, to convert parser outputs to your own data structures during parsing. Here are two examples. `A simple calculator` reads `1+2` and writes `3`, calculations are done during parsing. `A minimum Flow parser` convers a Flow program (not all features are supported) to an abstract data structure (AST), to allow different calculations to apply to the Flow program by reading the AST in different ways.

- [A simple calculator](../packages/tspc-test/src/TestRecursiveParser.ts)
- [A minimum Flow parser](https://github.com/microsoft/react-native-tscodegen/blob/master/packages/minimum-flow-parser/src/Parser.ts)

## API References

- **Tokenizer**: [Building a tokenizer using regular expressions](./Tokenizer.md).
- **Parser Combinators**: [Introduction to Parser Combinators](./ParserCombinators.md).
- **Utilities**
  - `expectEOF` looks into all results that returned at the same time, and pick all that consumes all tokens. If there is any result that fail to consume all tokens, an error will be generated as a hint.
  - `expectSingleResult` will see if there is only one result in the result list. If not, a `TokenError` is thrown.
  - `TokenRangeError` is similar to `TokenError` but it has a position range. This error will not be thrown by this library, it is reserved for your convenience.
