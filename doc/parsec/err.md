# Parser Combinator: err

```typescript
err(a, 'errorMessage')
```

This parser combinator gives a chance for replacing error messages.
When `a` fails, the error message is replaced by the one that is specified in the second argument.
When `a` succeeds, it works exactly as `a`.
