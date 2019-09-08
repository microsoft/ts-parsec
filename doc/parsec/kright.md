# Parser Combinator: kright

```typescript
kright(a, b)
```

works exactly as

```typescript
apply(seq(a, b), (value: [Ta, Tb]) => {
    return value[1];
})
```

Please see [seq](./seq.md) and [apply](./apply.md) for more details.

`kleft`, `kmid` and `kright` are helper functions to keep the code clean. For example, when we parse TypeScript's import statement, usually it looks like:

```typescript
import {apply, kleft, seq} from 'typescript-parsec';
```

Only the list of symbols and the package name is useful. Without helper functions, we write code like:

```typescript
apply(
    seq(
        str('import'),
        str('{'}),
        list_sc(
            tok(TokenKind.Identifier),
            str(',')
        ),
        str('}'),
        str('from'),
        tok(TokenKind.StringLiteral),
        str(';')
    ),
    (value: [{}, {}, Token<TokenKind>[], {}, {}, Token<TokenKind>, {}]) => {
        return Using(value[2], value[5]);
    }
)
```

There are too many useless items in the tuple to pass to `value`.
When the syntax is changed, we will need to change the parameter type,
and we need to count carefully to update `value[2]` and `value[5]`.
This could be solved by using `kleft`, `kmid` or `kright`.

Usually we have to choices:

```typescript
import {apply, kleft, seq} from 'typescript-parsec';
|      |                 |      |                 ||
|      +---           ---+---       kright     ---+|
|                                                  |
+-----------          kmid              -----------+
```

or

```typescript
import {apply, kleft, seq} from 'typescript-parsec';
|      |                 |      |                 ||
|      +---      kleft       ---+---           ---+|
|                                                  |
+-----------          kmid              -----------+
```

If we make the first choice, which means we use `kmid` to discard `import {` and `;` from `import {` `apply, kleft, seq} from 'typescript-parsec'` `;`,
and then consume `apply, kleft, seq`,
and then use `kright` to discard `} from` from `} from` `'typescript-parsec'`.
By doing this, we could reduce make the callback function for `apply` much more clean:

```typescript
apply(
    kmid(
        seq(                        //
            str('import'),          // This part is discarded by kmid
            str('{'})               //
        ),                          //
        seq(
            list_sc(
                tok(TokenKind.Identifier),
                str(',')
            ),
            kright(
                seq(                //
                    str('}'),       // This part is discarded by kright
                    str('from'),    //
                ),                  //
                tok(TokenKind.StringLiteral)
            )
        ),
        str(';')                    // This part is discard by kmid
    ),
    (value: [Token<TokenKind>[], Token<TokenKind>]) => {
        return Using(value[0], value[1]);
    }
)
```

Now all elements in `value` are useful. More importantly,
when the syntax changes,
if only two parts in the code is useful remains true,
we could use `kleft`, `kmid` and `kright` to keep `apply` receives only useful parts,
so that we don't need to count elements in `value`.
