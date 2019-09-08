# Parser Combinator: lrec

```typescript
lrec(a, b, f)
```

works exactly as

```typescript
seq(a, rep(b))
```

only with a different return type.
Instead of returning `[Ta, Tb[]]`, `lrec` returns the value from function `f`.
Please see [seq](./seq.md) and [rep](./rep.md) for more details.

`lrec(a, b, f)` means `a` followed by zero to infinite occurrences of `b`.
When no `b` succeeds, only `a` is returned.
When `b` succeeds multiple times, `f` is called multiple times.
So it requires the return type of `a` to be compatible to the return type of function `f`.

`lrec` and `lrec_sc` are similar to each other.
But just like `rep` and `rep_sc`,
`lrec_sc` only returns the longest result,
while `lrec` could return multiple results at the same time.

When facing `1 + 2 + 3`, sometimes we want `6` to be returned.
At the beginning we have:

```typescript
function addToNumbers(a: number, b: number): number {
    return a + b;
}

const NUMBER = apply(tok(TokenKind.Number), (token: Token<TokenKind>) => {
    return +token.text;
});

const parser1 =
    apply(
        seq(
            NUMBER,
            rep_sc(kright(str('+'), NUMBER))
        ),
        (value: [number, number[]]) => {
            return value[0] + value[1].reduce(addTwoNumbers, 0);
        }
    );
```

If we could replace it by `list_sc`, the adding function could be much simpler:

```typescript
const parser2 =
    apply(
        list_sc(NUMBER, str('+')),
        (value: number[]) => {
            // list_sc fails if there is no number, so value will never be empty.
            return value.reduce(addTwoNumbers);
        }
    );
```

Maybe you are satisfied with this.
But when more operators come with different precedences, it becomes annoying to copy boilerplate code.
Here `lrec_sc` helps:

```typescript
const parser3 = lrec_sc(NUMBER, kright(str('+'), NUMBER), addTwoNumbers);
```
