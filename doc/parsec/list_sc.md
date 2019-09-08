# Parser Combinator: list_sc

```typescript
list_sc(a, b)
```

works exactly as

```typescript
seq(a, rep_sc(kright(b, a)))
```

`list_sc(a, b)` means multiple `a` separated by `b`, for example, `1, 2, 3, 4`, could be parsed by:

```typescript
list_sc(tok(TokenKind.Number), str(','))
```

But instead of receiving `[Ta, Ta[]]` where the second element could be an empty array,
`list_sc` gives you `Ta[]`, which contains at least one element.

Note that `rep_sc` could return an empty array if the first `a` fails, but `list_sc` will fail in this case.

`list` and `list_sc` are similar to each other, while `list` returns all possible results, `list_sc` returns the longest result. Given `1, 2, 3, 4`:

```typescript
list(tok(TokenKind.Number), str(','))
```

gives you 4 results at the same time, consuming `1, 2, 3, 4`, `1, 2, 3`, `1, 2`, `1`, but

```typescript
list_sc(tok(TokenKind.Number), str(','))
```

only gives you the longest result, consuming `1, 2, 3, 4`.

Please see [seq](./seq.md), [kright](./kright.md) and [rep_sc](./rep.md) for more details.
