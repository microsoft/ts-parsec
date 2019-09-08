# Parser Combinator: nil

`nil<T>()` consumes no token and always succeeds by returning `undefined`.
Here `T` is the same to the one in `Token<T>`.

The most useful case for `nil` is to put in [alt](./alt.md),
but explicitly specifying `T` is boring,
so we have [opt](./opt.md) and [opt_sc](./opt_sc.md) to make the code clean.
