class Transaction {
    constructor(public amount: number, public date: Date) {}

    public getRoundUp(): number {
        const amount = this.amount * 100;
        const ceil = Math.ceil(this.amount) * 100;

        if (amount === ceil) return 0;
        return (ceil - amount) / 100;
    }
}

export default Transaction;
