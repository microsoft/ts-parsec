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

- [A simple calculator](./packages/tspc-test/src/TestRecursiveParser.ts)
- [A minimum Flow parser](https://github.com/microsoft/react-native-tscodegen/blob/master/packages/minimum-flow-parser/src/Parser.ts)

## In the Future

Following combinators will be released soon:

- **err**: Manually offering an error information and a way to do recovering when a specified parser fails.
- A context sensitive **apply** combinator.

Context sensitive tokenizer is also comming.
