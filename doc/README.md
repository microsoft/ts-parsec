# typescript-parsec Document

ts-parsec is a parser combinator library prepared for typescript. By using this library, you are able to create parsers very quickly using just a few lines of code. It provides the following features:

- **Tokenizer based on regular expressions**. This tokenizer is designed for convenience. For some cases its performance may be unsatisfying. In this case, you could write your own tokenizer. It is very easy to plug your tokenizer into ts-parsec.
- **Parser combinators**.
- The ability to support recursive syntax.

You are recommended to learn [EBNF](https://en.wikipedia.org/wiki/Extended_Backus%E2%80%93Naur_form) before using this library.

## Getting Started

[Getting Started](./GettingStarted.md).

## API References

- **Tokenizer**: [Building a tokenizer using regular expressions](./Tokenizer.md).
- **Parser Combinators**: [Introduction to Parser Combinators](./ParserCombinators.md).
- **Utilities**
  - `expectEOF` looks into all results that returned at the same time, and pick all that consumes all tokens. If there is any result that fail to consume all tokens, an error will be generated as a hint.
  - `expectSingleResult` will see if there is only one result in the result list. If not, a `TokenError` is thrown.
