# Parser Combinator: str

`range('min','max')` consumes a token, if the `text`'s length is 1 and the codepoint of `text` is between that of `min` (included) and `max` (included). It fails if it doesn't match the conditions.

For example, for passing TypeScript's export statement:

```typescript
3.142
```

We could write

```typescript
seq(range('1', '9'), str('.'), str(`142`))
```