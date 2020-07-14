# Parser Combinator: errd

```typescript
errd(a, 'errorMessage', defaultValue)
```

This parser combinator gives a chance for replacing error messages.
When `a` fails, the parser returns `defaultValue`, and the error message is replaced by the one that is specified in the second argument.
When `a` succeeds, it works exactly as `a`.

When a parser succeeds, the result could also contains error messages, indicating that fallbacks happended during parsing.

`errd` is similar to `opt_sc`,
but instead of returning `undefined` for a failure attempt,
a customized error message and return value are used.

The type of `defaultValue` should match the the result type of `a`. It is not allowed to introduce a union here.
