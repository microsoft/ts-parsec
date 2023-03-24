# Parser Combinator: repr

```typescript
rep_n(x, n)
```

means the input consists exactly `n` times of `x`.

For example, The following parser:

```typescript
rep_n(tok(TokenKind.Number), 3)
```

consumes `1 2 3`, and it only returns 1 result:

- `[1, 2, 3]`

Here `1` means a token whose `text` property is `'1'`.