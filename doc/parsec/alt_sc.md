# Parser Combinator: alt_sc

```typescript
alt_sc(a, b, c)
```

It is similar to `alt(a, b, c)`, but `alt_sc` only returns the first succeeded attempt.

`alt_sc(a, nil<T>())` could be replaced by `opt_sc(a)`.

There could be 2-16 arguments to fill in `alt_sc`.
When you need more than 16 arguments, just put multiple `alt_sc` in another `alt_sc` like this:

```typescript
alt_sc(alt_sc(a, b, c), alt_sc(d, e, f), ...)
```

It works exactly as

```typescript
alt_sc(a, b, c, d, e, f, ...)
```

Unlike `seq`, nesting `alt_sc` doesn't change the return type.
