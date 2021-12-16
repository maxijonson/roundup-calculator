import Transaction from "../Transaction";
import Parser from "./Parser";

class CIBCFrench extends Parser {
    constructor(pdfPath: string) {
        super(pdfPath);
    }

    async init(): Promise<void> {
        const { text } = await this.getFilePDF();
        const lines = text.split("\n");
        let currentLine = 0;

        while (currentLine < lines.length) {
            let line = lines[currentLine++];

            // Start of a transaction list
            if (line.startsWith("No de carte ")) {

                // Look for a line where the 6 first characters create a date
                let date: Date = new Date();
                do {
                    line = lines[currentLine++];
                    date = new Date(line.slice(0, 6));
                } while (currentLine < lines.length && isNaN(date.getTime()));

                if (isNaN(date.getTime())) {
                    if (currentLine === lines.length) continue; // Got an invalid date because there are no more lines
                    throw new Error(`"${line}" is not a valid date`);
                }

                // Look for an amount in the lines (including the one that contains the date)
                let amount: number = NaN;
                do {
                    const match = line.match(/\d+\,\d{2}/);
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

export default CIBCFrench;
