# Building a tokenizer using regular expressions

You could use `buildLexer` to create a tokenizer from regular expressions. If you want to write your own tokenizer, just create a linked list of `Token<T>` type. Usually `T` is the tag of tokens, just like `TokenKind` in the example.

```typescript
export interface Token<T> {
    readonly kind: T;
    readonly text: string;
    readonly pos: TokenPosition;
    readonly next: Token<T> | undefined;
}
```

`pos` is very important. During parsing, parser combinator will hit many errors, because it is very common that a small part of the parser combinator find itself encounter an unexpected token. In this case, the parser combinator returns an error with `pos`. A bigger parser combinator will then turn to another choise (for example, in `alt`, or `list_sc`). If all choices are all failed, it compares all errors that is returned from these choices, and return one that has consumed the most tokens.

When you write your own tokenizer, please take very carefully to generate `pos`. But if you use `buildLexer`, you just forget all of these details.

`buildLexer` consumes an array of a 3-element-tuple. Let's take a look at the example again:

```typescript
const tokenizer = buildLexer([
    [true, /^\d+(\.\d+)?/g, TokenKind.Number],
    [true, /^\,/g, TokenKind.Comma],
    [false, /^\s+/g, TokenKind.Space]
]);
```

There are 3 elements in each line. The first one indicates whether the tokenizer want to keep the token in the token stream or not. Here we don't care about spaces, so we set false. So that the token stream only has numbers and commas.

It is very common possible that, multiple token definitions match the prefix of the input from a position. At this moment, `buildLexer` will pick the longest one. If there are still multiple longest tokens with the same size, `buildLexer` will pick one that appears eariler in the array passing to `buildLexer`.

For example:

```typescript
const tokenizer = buildLexer([
    [true, /^true/g, 0],
    [true, /^\w+/g, 1],,
    [false, /^\s+/g, 2]
]);
```

If you gives `true trueLies`, 1st and 2nd both match `true`. But the 1st one appears eariler than the 2nd one in the array passing to `buildLexer`, so 1st wins.
And then you get to `trueLies` after skipping a space, 1st and 2nd both match the prefix of the input again. But 1st matches `true`, 2nd matches `trueLies`, 2nd is longer, so 2nd wins.

For some languages, like VB.NET, it has a context sensitive tokenizer. You could embed an XML in the code, while XML and VB.NET have two different sets of token definitions. `buildLexer` could not handle this case. If you have such need, you could:

- Write a manual tokenizer.
- Tell me and I add more features to the library for you.
- Make a pull request!

### NOTE

`buildLexer` accepts regular expressions that in this form: `/^xxx/g`.
