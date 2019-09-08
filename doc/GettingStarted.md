# Getting Started

There is a good example in [test/TestRecursiveParser.ts](https://github.com/microsoft/ts-parsec/blob/master/packages/ts-parsec/test/TestRecursiveParser.ts). But here I have a much more simple example. For example, you want to parse a list of numbers like this:

```plaintext
123, 456.789, 0
```

A number could be an integer or a decimal. Numbers are separated by commas. Spaces are ignored. So there are obviously 3 kinds of tokens:

```typescript
enum TokenKind {
    Number,
    Comma,
    Space
}
```

The easiest way to write a tokenizer is using regular expressions, so that you use `buildLexer` function.

```typescript
const tokenizer = buildLexer([
    [true, /^\d+(\.\d+)?/g, TokenKind.Number],
    [true, /^\,/g, TokenKind.Comma],
    [false, /^\s+/g, TokenKind.Space]
]);
```

Here `false` means that, after the tokenizer recognize this token, it is thrown away from the token stream. You don't read this token from the token stream.

Now, you need to define your parser:

```typescript
const numberListParser = list_sc(tok(TokenKind.Number), str(','));
```

`list_sc` means that the parser will try to consume tokens as much as possible.
If you use `list` instead of `list_sc`, you could get multiple results, which means, if you input `1,2,3`, you could get 3 results: `1`, `1,2`, `1,2,3.`.
This is a very useful feature when you need to deal with some ambiguity inside a bigger parser, but we don't need it here.

But at this moment, `numberListParser` doesn't give you a number array, it gives you a structure that **topological equivalent** to the syntax you provided. You need one more step to convert it to a number array:

```typescript
const numberListParser = apply(
    list_sc(tok(TokenKind.Number), str(',')),
    (tokens: Token<TokenKind.Number>[]]) => {
        return tokens.map((token: Token<TokenKind.Number>) => {
            return +token.text;
        });
    });
```

`apply` means that, you are not satisfy with the direct result of the parser, you want to transform it to your favorite data structure. Here you need a number array.

So let's try it!

```typescript
const numberArray = expectSingleResult(expectEOF(numberListParser.parse(tokenizer.parse('123, 456.789, 0'))));
```

Now you get: `[123, 456.789, 0]`!

After calling `expectSingleResult(expectEOF(x))`, you choose the best result among multiple ones returned from the parser. If all tokens are not consumed, you will get an exception, with details about where goes wrong in your input.

Don't forget to import all of these symbols!

```typescript
import {apply, buildLexer, expectEOF, expectSingleResult, list_sc, str, tok, Token} from 'typescript-parsec';
```
