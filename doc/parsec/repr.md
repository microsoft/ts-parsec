# Parser Combinator: repr

```typescript
repr(x)
```

means the input consists of multiple `x` from zero to infinite times.

`rep`, `repr` and `rep_sc` are similar to each other. For example, all following parsers:

```typescript
rep(tok(TokenKind.Number))
```

```typescript
repr(tok(TokenKind.Number))
```

```typescript
rep_sc(tok(TokenKind.Number))
```

consumes `1 2 3`. Both `rep` and `repr` return 4 results, but `rep_sc` only return 1 result:

- `rep`
  - `[1, 2, 3]`
  - `[1, 2]`
  - `[1]`
  - `[]`
- `repr`
  - `[]`
  - `[1]`
  - `[1, 2]`
  - `[1, 2, 3]`
- `rep_sc`
  - `[1, 2, 3]`

Here `1` means a token whose `text` property is `'1'`.
