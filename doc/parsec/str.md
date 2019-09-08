# Parser Combinator: str

`str('x')` consumes a token, if the `text` property of the token is exactly `'x'`. It fails if it doesn't match the `text` property.

For example, for passing TypeScript's export statement:

```typescript
export default Something;
```

We could write

```typescript
seq(str('export'), str('default'), tok(TokenKind.Identifier), str(';'))
```

The meaning of the code is very obvious to us.
