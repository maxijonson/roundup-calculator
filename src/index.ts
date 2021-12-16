import path from "path";
import fs from "fs";
import yargs from "yargs";
import Parser from "./classes/parsers/Parser";

console.clear();

const PARSERS = fs
    .readdirSync(path.join(__dirname, "classes", "parsers"))
    .filter((file) => file !== "Parser.ts")
    .map((file) => file.replace(".ts", ""));

(async () => {
    // Load argument "filePath" from command line
    const args = await yargs(process.argv.slice(2))
        .options({
            statement: {
                alias: "s",
                describe: "The path to the bank statement file",
                string: true,
                default: path.join(__dirname, "../secret/statement.pdf"),
                nargs: 1,
                normalize: true,
            },
            parser: {
                alias: "p",
                describe: "The bank parser to use",
                string: true,
                default: PARSERS[0],
                nargs: 1,
                options: PARSERS,
            },
        })
        .check((argv) => {
            argv.statement = argv.statement.trim();
            argv.parser = argv.parser.trim();
            if (!fs.existsSync(argv.statement)) {
                throw new Error(`File ${argv.statement} does not exist`);
            }
            if (!PARSERS.includes(argv.parser)) {
                throw new Error(`Parser ${argv.parser} is not supported`);
            }
            return true;
        })
        .wrap(yargs.terminalWidth()).argv;

    const parserPath = path.join(
        __dirname,
        `./classes/parsers/${args.parser}.ts`
    );
    const ParserClass = (await import(parserPath)).default;
    const parser: Parser = new ParserClass(args.statement);
    await parser.init();

    console.log(`Round ups: ${parser.getRoundUps().toFixed(2)}$`);
})();
