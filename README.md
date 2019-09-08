# ts-parsec

## Contributing

This project welcomes contributions and suggestions.  Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.opensource.microsoft.com.

When you submit a pull request, a CLA bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., status check, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

## Using ts-parsec with npm

```cmd
npm install -g typescript-parsec
```

## Building this repo

```cmd
yarn
yarn build
yarn test
```

## Packages

- **ts-parsec**: Parser combinator for TypeScript
- **tspc-test**: Unit test project
- **tspc-utilities**: Code generator for developing **ts-parsec**
  - At this moment, running `npm run update` will write overloadings for `alt` and `seq` for you

## Introduction

ts-parsec is a parser combinator library prepared for typescript. By using this library, you are able to create parsers very quickly using just a few lines of code. It provides the following features:

- **Tokenizer based on regular expressions**. This tokenizer is designed for convenience. For some cases its performance may be unsatisfying. In this case, you could write your own tokenizer. It is very easy to plug your tokenizer into ts-parsec.
- **Parser combinators**.
- The ability to support recursive syntax.

You are recommended to learn [EBNF](https://en.wikipedia.org/wiki/Extended_Backus%E2%80%93Naur_form) before using this library.

Please read [Getting Started](./doc/GettingStarted.md) for ramping up, or our [document page](./doc/README.md) for deeper understanding.

## More Examples

- [A simple calculator](./packages/ts-parsec/test/TestRecursiveParser.ts)
- [A minimum Flow parser](https://github.com/microsoft/react-native-tscodegen/blob/master/packages/minimum-flow-parser/src/Parser.ts)

## In the Future

This project could be open sourced in a separate repo. And I am going to add more features to this library, like:

- context sensitive tokenizer.
- context sensitive `apply` handler.
- localized ambiguity recognizing.
- customizable error reporting.
- etc .

Localized ambiguity recognizing is also very useful. For example, you try to parse C programs and get this:

```C
typedef int X;
int Y;

int main()
{
    X * a;
    Y * a;
    return 0;
}
```

Both `X * a;` and `Y * a;` could be interpreted as variable definition or expression. This is ambiguity, and it could be resolved by context sensitive information. Usually you will have two choices:

- Resolve ambiguity using context sensitive information. This requires you to maintain a symbol table while parsing `typedef int X;` and `int Y;`. In the future, when the handler passing to `apply` is given more API to maintain a data structure that could be passing along parsing, you are able to know that `X * a;` is a variable definition and `Y * a` is an expression. Since ts-parsec handles ambiguity by running parsers parallelly (not threading related), **you cannot just maintain a global variable**, because you don't know when the data created by an `apply` handler need to be discarded when this branch of the parser fails later.
- Package amgiguous choices locally. At this moment, since both `X * a;` and `Y * a;` have two different ways to interpret, the parser will give you 2*2=4 results. If you have 10 statements like this, you will get up to 1024 results! This is not acceptable! If you don't want to resolve ambiguity immediately, another choice could be that, the parser tells you ambiguity happens during a local area of the code, and you could store this information in your well-designed [AST](https://en.wikipedia.org/wiki/Abstract_syntax_tree). In this case, you will get a tree, when you iterate into the function body, you find there are 3 statements, first two of which are ambiguous, each with two possible interpretations listed side. Then instead of having 4 results, you have just 1, although ambiguity is not resolved.
