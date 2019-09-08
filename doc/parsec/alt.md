# Parser Combinator: alt

```typescript
alt(a, b, c)
```

means the input matches at least one in `a`, `b` and `c`.
For example, for passing TypeScript's boolean literal `true` or `false`, we could write:

```typescript
alt(str('true'), str('false'))
```

The meaning of the code is very obvious to us: either `true` or `false` is OK. But if the input is another token like `1`, it fails.

Another example, TypeScript allows optional semicolons, which means either `DoSomething()` or `DoSomething();` is fine. In this case, we could write:

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

There could be 2-16 arguments to fill in `alt`.
When you need more than 16 arguments, just put multiple `alt` in another `alt` like this:

```typescript
alt(alt(a, b, c), alt(d, e, f), ...)
```

It works exactly as

```typescript
alt(a, b, c, d, e, f, ...)
```

Unlike `seq`, nesting `alt` doesn't change the return type.
