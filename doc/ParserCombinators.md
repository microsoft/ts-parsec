# Introduction to Parser Combinators

You define a `LL parser` by `EBNF`, and then translate it using parser combinators. All parser combinators could return multiple results, except those ends with `_sc`, which means `short cut`.
Short cut combinators returns the best result, even if it could fail the whole parser.
You need to choose them wisely.

ts-parsec provides the following combinators. When I say "`P` returns `T`", it doesn't mean the function `P` returns a value of type `T`, it means that `returnValue.candidates[something].result` is `T`. In most of the cases, you don't need to deal with multiple results by yourself, this is why you want to call `exceptSingleResult` and `expectEOF`. They are explained [here](./README.md).

- Token Filters
  - [nil()](./parsec/nil.md): Consumes no token and returns `undefined`.
  - [str('x')](./parsec/str.md): Consumes a token that is `'x'`.
  - [tok(x)](./parsec/tok.md): Consumes a token whose `kind` is `x`. If you use `buildLexer`, these values of `x` is put in the 3rd place in each line.
- Sequencial
  - [seq(a,b,c)](./parsec/seq.md): Consumes tokens that matches `a`, `b` and then `c` in order. It returns a tuple, containing results from `a`, `b` and `c` in order. You could put 2-16 arguments in `seq`.
  - [kleft(a, b)](./parsec/kleft.md): Just like `seq(a, b)` but only result of `a` is returned.
  - [kmid(a, b, c)](./parsec/kmid.md): Just like `seq(a, b, c)` but only result of `b` is returned.
  - [kright(a, b)](./parsec/kright.md): Just like `seq(a, b)` but only result of `b` is returned.
- Alternative
  - [alt(a,b,c)](./parsec/alt.md): Consumes tokens that matches `a`, `b` or `c`. It returns a union type, which could be the result of `a`, `b` or `c`. If multiple parsers in `alt` matches, they are all returned. If non of them match, it fails. You could put 2-16 arguments in `alt`.
  - [opt_sc(x)](./parsec/opt_sc.md): Consumes tokens that matches `x`, and if it fails, returns `undefined`.
  - [opt(x)](./parsec/opt.md): Consumes tokens that matches `x`. If it succeeds, returns the result and `undefined`. If it fails, returns `undefined`.
- Repeative
  - [rep_sc(x)](./parsec/rep_sc.md): Consumes tokens that matches `x`. It will try multiple times, until it fails. It returns an array of all results from `x` in order. If `x` fails in the first try, it returns `[]`.
  - [rep(x)](./parsec/rep.md) and [repr(x)](./parsec/repr.md): Just like `rep_sc`, but it returns all possible arrays. For example, if `x` succeeds 3 times, rep returns `[x1, x2, x3]`, `[x1, x2]`, `[x1]` and `[]`. `repr` returns the same set of results in a reverse order.
  - [list(x,d)](./parsec/list.md) and [list_sc(x,d)](./parsec/list_sc.md): It works like `rep(x)` and `rep_sc(x)`, but you can specify a delimiter between `x`s.
- Left Recursive
  - [lrec(a,b,f)](./parsec/lrec.md) and [lrec_sc(a,b,f)](./parsec/lrec_sc.md): It works like `apply(seq(a, rep(b)), F(f))` and `apply(seq(a, rep_sc(b), F(f))`. This parser requires `a` to succeed. If `b` succeeds multiple times, `f(a,b)` will be called for multiple times.
- Others
  - [apply(x, f)](./parsec/apply.md): Consumes tokens that matches `x`, and if it succeeds, passs each result to `f`, and returns what `f` returns. Details will be explained later.

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
