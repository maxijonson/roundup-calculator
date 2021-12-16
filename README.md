# Roundup Calculator

Roundup Calculator gives you the sum of your rounded transactions from a bank's eStatement. For example, if you had 3 transactions, 13.37, 4.20 and 10.00, here's what the roundups would give you:

-   13.37 -> 14.00 (0.63$)
-   4.20 -> 5.00 (0.80$)
-   10.00 -> 10.00 (0.00$)
-   Total -> 0.63 + 0.80 = 1.43$

## Motivation

I've been using Moka (and recently Wealthsimple Invest) to invest my spare change. These apps do a little bit more than what I just described above: they round up your transactions to the nearest dollar, just like Roundup Calculator does. However, they also invest it in a TFSA (Tax Free Savings Account).

The problem came when both of these apps have been having issues connecting to my bank. They are both using Plaid, which I am guessing have trouble connecting to it sometimes. This results in no roundups being calculated and no money being invested. This project is a workaround for when this happens.

## How it works

Give a file path to an eStatement and the bank you're using and it will parse the transactions and calculate the roundup. You can then manually invest the roundup in a TFSA, or do whatever you want with it.

## Supported Bank~~s~~

Since I only have one bank, the only bank supported right now is CIBC with French eStatements. There are also no plans to support other banks, since I would need example eStatements to create other strategies. However, if you're up for it, the project is already structured in a way that you can add your own bank (and maybe do a PR? :) ).

## How to add a Parser

1. Create a new strategy class in `src/classes/parsers`
2. Extend it with the `Parser` class and implement the necessary methods. A `secret` folder has been added so you can easily test your parser without publishing your private statements!
3. All done! You should now be able to use your parser by using its file name (without .ts) (see Usage below)

## Usage

Use NPM start script with arguments!

### Show Help

View usage instructions.

```bash
npm start -- --help
```

### Run the Roundup Calculator

```bash
npm start -- [-s <statementFile>] [-p <parser name>]
```

_Tip: Use VSCode to use the installed launch configurations_

## Privacy

Since this project uses no third party services (APIs or other HTTP requests), it is 100% private. Your processed statements are only used by you and stay with you. This also means the project runs offline, should you need it.
