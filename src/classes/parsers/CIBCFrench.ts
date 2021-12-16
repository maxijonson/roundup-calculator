import fs from "fs";
import Transaction from "../Transaction";
import Parser from "./Parser";

const MONTHS: { [key: string]: string } = {
    jan: "jan",
    fév: "feb",
    mar: "mar",
    avr: "apr",
    mai: "may",
    jun: "jun",
    jlt: "jul",
    aoû: "aug",
    sep: "sep",
    oct: "oct",
    nov: "nov",
    déc: "dec",
};

class CIBCFrench extends Parser {
    constructor(pdfPath: string) {
        super(pdfPath);
    }

    async init(): Promise<void> {
        const { text } = await this.getFilePDF();
        fs.writeFileSync("secret/CIBCFrench.txt", text);
        const lines = text.split("\n");
        let currentLine = 0;

        while (currentLine < lines.length) {
            let line = lines[currentLine++];

            // Start of a transaction list
            if (line.startsWith("No de carte ")) {
                while (currentLine < lines.length) {
                    // Look for a line where the 6 first characters create a date
                    let date: Date = new Date();
                    let missed = 0;
                    do {
                        line = lines[currentLine++];
                        const m = line.substring(0, 3);
                        const d = line.substring(4, 6);
                        date = new Date(`${MONTHS[m] ?? m} ${d}`);
                        missed++;
                    } while (
                        currentLine < lines.length &&
                        isNaN(date.getTime()) &&
                        missed < 3
                    );

                    if (missed === 3) break; // Assume we've reached the end of the transactions

                    if (isNaN(date.getTime())) {
                        if (currentLine === lines.length) continue; // Got an invalid date because there are no more lines
                        throw new Error(`"${line}" is not a valid date`);
                    }

                    // Look for an amount in the lines (including the one that contains the date)
                    let amount: number = NaN;
                    do {
                        const match = line.substring(line.length - 10).match(/\d+\,\d{2}/);
                        if (match) {
                            amount = parseFloat(match[0].replace(",", "."));
                        } else {
                            line = lines[currentLine++];
                        }
                    } while (currentLine < lines.length && isNaN(amount));

                    if (isNaN(amount)) {
                        if (currentLine === lines.length) continue; // Got an invalid amount because there are no more lines
                        throw new Error(`"${line}" is not a valid amount`);
                    }

                    this.transactions.push(new Transaction(amount, date));
                }
            }
        }
    }
}

export default CIBCFrench;
