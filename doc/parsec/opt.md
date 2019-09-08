# Parser Combinator: opt

```typescript
opt(a)
```

works exactly as

```typescript
alt(a, nil<T>())
```

Please see [alt](./alt.md) and [nil](./nil.md) for more details.

Usually we don't need to parse type arguments to parser combinator functions, but `nil<T>()` is different.
Because by just writing `nil()`, TypeScript has no information to infer the type argument `T` for us.
Since the most useful case for `nil<T>()` is to put in `alt`, so here we provide `opt` to make the code clean.

If you need `alt(a, b, c, nil<T>())`, then `opt(alt(a, b, c))` is recommended.
