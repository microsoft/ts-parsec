# Parser Combinator: opt_sc

```typescript
opt_sc(a)
```

works similar as

```typescript
alt(a, nil<T>())
```

Since `nil<T>()` always succeeds, `alt(a, nil<T>())` always succeeds. When `a` succeeds, it returns both `Ta` and `undefined` at the same time.
But `opt_sc` is different. When `a` succeeds, it returns only `Ta`.

Please see [alt](./alt.md) and [nil](./nil.md) for more details.

Usually we don't need to pass type arguments to parser combinator functions, but `nil<T>()` is different.
Because by just writing `nil()`, TypeScript has no information to infer the type argument `T` for us.
Since the most useful case for `nil<T>()` is to put in `alt`, so here we provide `opt` to make the code clean.

If you need `alt(a, b, c, nil<T>())`, then `opt_sc(alt(a, b, c))` is recommended, when you don't want to also receive `undefined` when `alt` succeeds.

`opt` and `opt_sc` are similar to each other,
while `opt(a)` returns both `Ta` and `undefined` when `a` succeeds,
`opt_sc(a)` only returns `Ta`.

Both `opt(a)` and `opt_sc(a)` returns `undefined` when `a` fails.

For example, TypeScript allows optional semicolons, which means either `DoSomething()` or `DoSomething();` is fine. In this case, we could write:

```typescript
seq(EXPRESSION, alt(str(';'), nil<T>()))
```

It returns `[TExpression, Token<T> | undefined]`.
`alt(a, nil<T>())` could be replaced by `opt(a)` or `opt_sc(a)` in different situations.
In this case, we don't care whether there is a semicolon or not, we only need the expression.
We could optimize the parser like this:

```typescript
kleft(EXPRESSION, opt_sc(';'))
```

It returns `TExpression`.

Please note that, `opt_sc` here is better than `opt`, actually `opt` cannot be used here.
Because when we parse a TypeScript program, multiple statements could appear one by one in a block statement.
Besides of expression statements, a single semicolon could be a statement.

Assume that we prepare a parser like this

```typescript
kmid(
    str('{'),
    opt_sc(alt(
        kleft(EXPRESSION, opt(str(';'))),
        str(';');
    ))
    str('}')
)
```

Then we begin to test the parser. First we test `{}`, it works fine, returning a block statement with no statement inside.

And then we test `{;}`, it still works fine, returning a block statement with `;` inside.

And then we test `{DoSomething()}`, it still works fine, return a block statement with `DoSomething()` inside, just like we have inserted `;` automatically.

But now we test `{DoSomething();`}, the input becomes ambiguous, because `DoSomething();` could also be two statement: `DoSomething()` and `;`.

By having `opt_sc(str(';'))` instead of `opt(str(';')))`, the semicolon will be consumed when `EXPRESSION` succeeds, so the input could not be ambiguous.

If we use `opt` here, it returns 2 results, so that `DoSomething();` could have the whole text consumed, and have only `DoSomething()`consumed at the same time. This makes the input be ambiguous.
