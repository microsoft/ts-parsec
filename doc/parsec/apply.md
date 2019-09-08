# Parser Combinator: apply

```typescript
apply(x, f)
```

works exactly as

```typescript
x
```

but it changes the return type of `x`, by applying each result to function `f`.

For example, when parsing number lists, we could write:

```typescript
list_sc(tok(TokenKind.Number), str(','))
```

When it consumes `1, 2, 3`, it returns 1 result, which is an array of 3 `Token<TokenKind>`.

In most of the cases, we feel uncomfortable to this and we want to get a real number array, here is why we have `apply`:

```typescript
list_sc(
    apply(
        tok(TokenKind.Number),
        (value: Token<TokenKind>) => { +value.text; }
    ),
    str(',')
)
```

Now all tokens returned by `tok` is applied to the function, and we get a real array: `[1, 2, 3]`.

You could also write the parser in the following way. It is equivalent to the parser above, but it looks more complicated. Here is just a demo, it is not recommended to mess up clean code:

```typescript
apply(
    list_sc(tok(TokenKind.Number), str(',')),
    (value: Token<TokenKind>[]) => {
        return value.map((token: Token<TokenKind>) => {
            return +token.text;
        })
    }
)
```

Knowing return types of parser combinator functions is important, so that to use `apply` in a correct way.
