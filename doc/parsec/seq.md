# Parser Combinator: seq

```typescript
seq(a, b, c)
```

means the input consists of `a`, `b` and `c` in order.
For example, for passing TypeScript's export statement:

```typescript
export default Something;
```

We could write

```typescript
seq(str('export'), str('default'), tok(TokenKind.Identifier), str(';'))
```

The meaning of the code is very obvious to us: `export`, `default`, the symbol name and `;` should appear one by one in order.
When anything is missing or replaced by wrong tokens, `seq` fails.

There could be 2-16 arguments to fill in `seq`.
When you need more than 16 arguments, just put multiple `seq` in another `seq` like this:

```typescript
seq(seq(a, b, c), seq(d, e, f), ...)
```

It works exactly as

```typescript
seq(a, b, c, d, e, f, ...)
```

But please note that nesting `seq` could change the return type.

```typescript
seq(a, b, c, d)
```

returns `[Ta, Tb, Tc, Td]`, but

```typescript
seq(seq(a, b), seq(c, d))
```

returns `[[Ta, Tb], [Tc, Td]]`.
