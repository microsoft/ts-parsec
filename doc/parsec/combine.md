# Parser Combinator: combine

```typescript
combine(a, (x)=>b, (x)=>c)
```

means the input consists of `a`, `b` and `c` in order,
returning the result from the last parser,
when all parsers after `a` depend on the result of the previous parser.

For example, a list followed by the length of it:

```typescript
3 foo,bar,baz
```

could be parsed by

```typescript
combine(
    NUMBER,
    (count: number) => (
        count < 1
        ? fail('insufficient length')
        : list_n(NAME, str(','), count)
        )
)
```

When the first token is `0`, the parser becomes `fail`, and it fails.

When the first token is a positive number, the parser becomes `list_n` of `NAME`.

In this example, if the input is `2 foo,bar,baz`, it consumes only `2 foo,bar`.

`combine` is very useful for context sensitive syntax.

There could be 2-16 arguments to fill in `combine`.
When you need more than 16 arguments, just put multiple `combine` in another `combine` like this:

```typescript
combine(combine(a, (x)=>b, (x)=>c), (x)=>combine(d, (x)=>e, (x)=>f), ...)
```

It works exactly as

```typescript
combine(a, (x)=>b, (x)=>c, (x)=>d, (x)=>e, (x)=>f, ...)
