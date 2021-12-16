import fs from "fs";
import pdf from "pdf-parse";
import Transaction from "../Transaction";

abstract class Parser {
    protected transactions: Transaction[] = [];

    protected constructor(protected filePath: string) {}

    abstract init(): Promise<void>;

    public getFilePath(): string {
        return this.filePath;
    }

    public getTransactions(): Transaction[] {
        return this.transactions;
    }

    public getRoundUps() {
        return this.transactions.reduce((sum, transaction) => {
            return sum + transaction.getRoundUp();
        }, 0);
    }

    protected getFileBuffer(): Buffer {
        return fs.readFileSync(this.filePath);
    }

    protected getFilePDF() {
        const file = this.getFileBuffer();
        // Validate file is PDF type
        if (file.slice(0, 4).toString() !== "%PDF") {
            throw new Error("File is not a PDF");
        }
        return pdf(file);
    }
}

export default Parser;
