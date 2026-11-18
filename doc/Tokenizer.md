# Building a tokenizer using regular expressions

You could use `buildLexer` to create a tokenizer from regular expressions. If you want to write your own tokenizer, just create a linked list of `Token<T>` type. Usually `T` is the tag of tokens, just like `TokenKind` in [A simple calculator](../packages/tspc-test/src/TestRecursiveParser.ts).

```typescript
export interface Token<T> {
    readonly kind: T;
    readonly text: string;
    readonly pos: TokenPosition;
    readonly next: Token<T> | undefined;
}
```

`pos` is very important. During parsing, parser combinator will hit many errors, because it is very common that a small part of the parser combinator find itself encounter an unexpected token. In this case, the parser combinator returns an error with `pos`. A bigger parser combinator will then turn to another choice (for example, in `alt`, or `list_sc`). If all choices are failed, it compares all errors from these choices, and return one that has consumed the most tokens.

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

If you gives `true trueLies`, 1st and 2nd both match `true`. But the 1st one appears earlier than the 2nd one in the array passing to `buildLexer`, so 1st wins.
And then you get to `trueLies` after skipping a space, 1st and 2nd both match the prefix of the input again. But 1st matches `true`, 2nd matches `trueLies`, 2nd is longer, so 2nd wins.

For some languages, like VB.NET, it has a context sensitive tokenizer. You could embed an XML in the code, while XML and VB.NET have two different sets of token definitions. `buildLexer` could not handle this case. If you have such need, you could:

- Write a manual tokenizer.
- Tell me and I add more features to the library for you.
- Make a pull request!

## NOTE

`buildLexer` only accepts regular expressions like this: `/^xxx/g`.

## Stateful tokenization

Internally, the lexer maintains a stack of states that you can grow. A state is
defined as the set of rules that the lexer uses to tokenize the input. For
instance, in the examples shown above, `buildLexer` was used to create a lexer
with a single state with three rules each. Stateful tokenization is useful if
you want to provide different rules to the lexer based on previously matched
tokens.

The following example shows a lexer that tokenizes nested block comments. Start
by looking at the set of top-level rules defined by `buildLexer`. These rules
look standard, except for the rule that recognizes a `TokenKind.CommentBegin`.
When a rule contains a fourth element, and the rule is matched, it means that
the lexer will switch to a different state. In this case, the fourth element
tells us that the lexer will switch to the `BlockComment` state by pushing the
state to its internal stack. The definition of a state works almost analogously
to the definition of the top-level state using `buildLexer`. When the tokenizer
switches to another state, only the rules defined inside of that state apply
until the tokenizer leaves the state again. To leave a state, the fourth element
of a rule can be set to `'pop'`, which pops the state off of the lexers'
internal stack. In case you wish to push the same state to the stack that you
are already in, use the `'push'` directive. When the fourth element of a rule is
omitted, the lexer will remain in its current state.

```typescript
const blockComment: LexerState<TokenKind> = [
    [false, /^\/\*/g, TokenKind.CommentBegin, "push"], // nested comment
    [false, /^\*\//g, TokenKind.CommentEnd, "pop"],
    [true, /^(?:(?!\/\*|\*\/).)+/g, TokenKind.CommentContents],
];

const tokenizer = buildLexer([
    [false, /^\/\*/g, TokenKind.CommentBegin, blockComment],
    [true, /^\d+/g, TokenKind.Number],
    [true, /^[a-zA-Z]\w*/g, TokenKind.Identifier],
    [false, /^,/g, TokenKind.Comma],
    [false, /^\s+/g, TokenKind.Space],
]);
```
