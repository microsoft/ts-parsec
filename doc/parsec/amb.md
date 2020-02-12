# Parser Combinator: amb

```typescript
amb(x)
```

means the input matches `x`, and results of it are grouped together if they consume the same amount of tokens.
For example, for the following parser:

```typescript
const ab = apply(seq(str('a'), str('b')), () => 'ab');
const bc = apply(seq(str('b'), str('c')), () => 'bc');
const a_bc = apply(seq(str('a'), bc), ([_a, _bc]: [Token<T>, string]) => `a, ${_bc}`);
const ab_c = apply(seq(ab, str('c')), ([_ab, _c_]: [string, Token<T>]) => `${_ab}, c`);
const abc = alt(a_bc, ab_c);
```

Obviously, for input `a b c`, parser `abc` returns 2 results: `a, bc` and `ab, c`.

If a big parser uses `abc` to parse a big input with `a b c` in the middle of it,
it duplicates a lot of things before and after `a b c` and also returns 2 results,
this is a waste of time and memory.

`amb` is a solution for this problem. `amb(abc)` returns 1 result, which is `['a, bc', 'ab, c']`, instead of 2 results.
We limit the ambiguity inside a big AST in this way.
The only requirement is that,
you need to express ambiguity in the type of your AST,
and then you will be offered a chance to perform deambiguity on your AST.

Another example is the C programming language. Consider the following function:

```C
int main()
{
    A*b;
    C*d;
}
```

Both `A` and `C` could be types or values.
`A*b` could be a variable declaraiton or a binary expression.
Without `amb`, we will get a result of 4 ASTs because of these 2 statements.

Obviously it is very easy to foresee the ambiguity because this is a very famous problem.
By using `amb`, we will get just a single AST of `main` function, inside with we have 2 statements.
Each statement is ambiguous and we will be able to access all possibilities.

After that, we just need to decide which one is legal and which one is not,
by building a symbol table in one pass.
`amb` frees us from a need of mixing parsing and semantic analyzing together,
improves the code readability alot.

This saves a huge amount of time and memory.
