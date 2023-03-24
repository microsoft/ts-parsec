# Parser Combinator: list_n

```typescript
list_n(a, b, n)
```

works exactly as

```typescript
opt_sc(seq(a, rep_n(kright(b, a), n - 1)))
```

`list_n(a, b, n)` means the input consists exactly `n` times of `a` separated by `b`. If `n` < 1, it is equivalent to `succ([])`. For example, `1, 2, 3, 4`, could be parsed by:

```typescript
list_n(tok(TokenKind.Number), str(','), 4)
```

But instead of receiving `[Ta, Ta[]] | undefined` where it could be `undefined` or the second element could be an empty array,
`list_sc` gives you `Ta[]`.

Please see [seq](./seq.md), [opt_sc](./opt_sc.md) and [rep_n](./rep_n.md) for more details.
