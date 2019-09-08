# Parser Combinator: opt

```typescript
opt(a)
```

works exactly as

```typescript
alt(a, nil<T>())
```

Since `nil<T>()` always succeeds, `alt(a, nil<T>())` always succeeds. When `a` succeeds, it returns both `Ta` and `undefined` at the same time. The same to `opt`.

Please see [alt](./alt.md) and [nil](./nil.md) for more details.

Usually we don't need to pass type arguments to parser combinator functions, but `nil<T>()` is different.
Because by just writing `nil()`, TypeScript has no information to infer the type argument `T` for us.
Since the most useful case for `nil<T>()` is to put in `alt`, so here we provide `opt` to make the code clean.

If you need `alt(a, b, c, nil<T>())`, then `opt(alt(a, b, c))` is recommended.

`opt` and `opt_sc` are similar to each other,
while `opt(a)` returns both `Ta` and `undefined` when `a` succeeds,
`opt_sc(a)` only returns `Ta`.

Both `opt(a)` and `opt_sc(a)` returns `undefined` when `a` fails.
