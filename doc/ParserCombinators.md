# Introduction to Parser Combinators

You define a `LL parser` by `EBNF`, and then translate it using parser combinators. All parser combinators could return multiple results, except those ends with `_sc`, which means `short cut`.
Short cut combinators returns the best result, even if it could fail the whole parser.
You need to choose them wisely.

## Parser Combinator Functions

ts-parsec provides the following combinators.

When I say "`P` returns `T`", it doesn't mean the function `P` returns a value of type `T`, it means that `returnValue.candidates[something].result` is `T`.

If a parser combinator involves other parser combinators, like `seq(a,b)`, then `a` returns `Ta`, `b` returns `Tb`, so `seq(a,b)` returns `[Ta, Tb]`.

In most of the cases, you don't need to deal with multiple results by yourself, this is why you want to call `exceptSingleResult` and `expectEOF`. They are explained [here](./README.md).

- Token Filters
  - [nil()](./parsec/nil.md):
    - Consumes no token.
    - Returns `undefined`.
    - Never fails.
  - [str('x')](./parsec/str.md):
    - Consumes a token that is `'x'`.
    - Returns `Token<T>`.
    - Fails if the current token could not be consumed.
  - [tok(x)](./parsec/tok.md):
    - Consumes a token whose `kind` is `x`. If you use `buildLexer`, these values of `x` is put in the 3rd place in each line.
    - Returns `Token<T>`.
    - Fails if the current token could not be consumed.
- Sequencial
  - [seq(a, b, c)](./parsec/seq.md):
    - Consumes tokens that matches `a`, `b` and then `c` in order. You could put 2-16 arguments in `seq`.
    - Returns `[Ta, Tb, Tc]`.
    - Fails if **one of** `a`, `b` and `c` fails.
  - [kleft(a, b)](./parsec/kleft.md):
    - Equivalent to `seq(a, b)`.
    - Returns `Ta`.
    - Fails if **one of** `a` and `b` fails.
  - [kmid(a, b, c)](./parsec/kmid.md):
    - Equivalent to `seq(a, b, c)`.
    - Returns `Tb`.
    - Fails if **one of** `a`, `b` and `c` fails.
  - [kright(a, b)](./parsec/kright.md):
    - Equivalent to `seq(a, b)`.
    - Returns `Tb`.
    - Fails if **one of** `a` and `b` fails.
- Alternative
  - [alt(a, b, c)](./parsec/alt.md):
    - Consumes tokens that matches `a`, `b` or `c`. You could put 2-16 arguments in `alt`.
    - Returns `Ta | Tb | Tc`.
    - Fails if **all of** `a`, `b` or `c` fails.
  - [opt_sc(x)](./parsec/opt_sc.md):
    - Consumes `x`.
    - Returns `Tx | undefined`. It returns `undefined` only if `x` fails.
    - Never fails.
  - [opt(x)](./parsec/opt.md):
    - Equivalent to `x | nil<T>()`.
    - returns `Tx | undefined`.
    - Never fails.
- Repeative
  - [rep_sc(x)](./parsec/rep_sc.md):
    - Consumes as many `x` as possible.
    - Returns `Tx[]`. If no `x` could be consumed, it returns `[]`.
    - Never fails.
  - [rep(x)](./parsec/rep.md):
    - Consumes `x` zero to multiple times.
    - Returns `Tx[]`. If 3 `x` are consumes, it returns 4 results at the same time: `[x1, x2, x3]`, `[x1, x2]`, `[x1]` and `[]`.
    - Never fails.
  - [repr(x)](./parsec/repr.md):
    - Consumes `x` zero to multiple times.
    - Returns `Tx[]`. If 3 `x` are consumes, it returns 4 results at the same time: `[]`, `[x1]`, `[x1, x2]`, and `[x1, x2, x3]`.
    - Never fails.
  - [list(x, d)](./parsec/list.md).
    - Equivalent to `seq(x, rep(x, d))`.
    - Returns `Tx[]`, instead of `[Tx, Tx[]]`.
    - Fails if `x` succeeds zero times.
  - [list_sc(x,d)](./parsec/list_sc.md):
    - Equivalent to `seq(x, rep_sc(x, d))`.
    - Returns `Tx[]`, instead of `[Tx, Tx[]]`.
    - Fails if `x` succeeds zero times.
- Left Recursive
  - [lrec(a, b, f)](./parsec/lrec.md):
    - Equivalent to `seq(a, rep(b))`.
    - Returns the result of function `f`.
    - Fails if `a` fails.
  - [lrec_sc(a,b,f)](./parsec/lrec_sc.md):
    - Equivalent to `seq(a, rep(b)))`.
    - Returns the result of function `f`.
    - Fails if `a` fails.
- Others
  - [apply(x, f)](./parsec/apply.md):
    - Equivalent to `x`.
    - Returns the result of function `f`. The function will be called against the result of `x`, if `x` succeeds.
    - Fails if `x` fails.

## Recursive Syntax

Recursive syntax is also very common. Sometimes you need to parse a tree, not just a list, so `lrec`, `lrec_sc` and `rule` is your friend.

You are recommended to read [A simple calculator](../packages/tspc-test/src/TestRecursiveParser.ts) if you have never learnt about `EBNF`.

### Left Recursive

`lrec` and `lrec_sc` means **Left Recursive (with Short Cut)**. They work in the same way, except that `lrec_sc` returns a single result which consumes tokens as much as possible, `lrec` returns multiple possible results.

Left recursive is a special kind of recursive, usually it appears in left-associated binary operator. In `test/TestRecursiveParser.ts`, there are `TERM`, `FACTOR` and `EXP`.

#### TERM

`TERM` is very straight forward. It parses `1`, `+1`, `-1`, or `(something)`.

#### FACTOR

`FACTOR` is a left recursive parser. It consumes `1`, `1*2` or `1*2*3`. For `1*2*3...`, it is very clear that the structure is `1`, `*2`, `*3`... . And let's look at how `FACTOR` is implemented:

```typescript
lrec_sc(
    TERM,
    seq(
        alt(str('*'), str('/')),
        TERM
    ),
    applyBinary
)
```

According to the description above, `lrec_sc(a,b,f)` is `apply(seq(a, rep_sc(b)), F(f))`. So `FACTOR` will first need to parse `1`, and then it parses `*2`, `*3`, until it fails.

At this moment, you get a result like `['1', ['*2', '*3']]`. And then `f` is called in this way: `f(f('1', '*2'), '*3')`. This is what `F(f)` does here.

It is very cleared that, the way it calls `f` is left-associated, so this is a left recursive parser.

There is no need to have a right recursive parser function, because you could just call this parser inside itself, by using `rule`, which will be explained later.

#### EXP

Splitting `+`, `-` and `*`, `/` to `EXP` and `FACTOR` and letting `EXP` call `FACTOR` is a common trick to specify operator precedence. If you need to parse C++, which has about 20 levels of operator precedence, you will need to have 20 `EXP`s calling each other.

### Recursive

`EXP` calls `FACTOR`, `FACTOR` calls `TERM`, and `TERM` finally calls `EXP` again. This is recursive. You are not able to do this in one parser combinator expression. This is why you need `rule`. `rule` returns a parser, you can set another parser to it later by calling the `setPattern` member function.
When defining `TERM`, `EXP` is not yet defined, no problem! When `EXP.setPattern` is called, `TERM` will know `EXP`` is updated immediately.
