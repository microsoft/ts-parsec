# Parser Combinator: tok

`tok(x)` consumes a token, if the `kind` property of the token is exactly `x`. If fails if it doesn't match the `kind` property.

For example, for passing TypeScript's export statement:

```typescript
export default Something;
```

We could write

```typescript
seq(str('export'), str('default'), tok(TokenKind.Identifier), str(';'))
```

The meaning of the code is very obvious to us.
