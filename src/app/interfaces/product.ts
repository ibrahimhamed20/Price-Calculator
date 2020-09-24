export interface IProduct {
    id?: number;
    name?: string;
    itemUrl?: string;
    price?: number;
    category?: string;
    color?: string;
    weight?: number;
    quantity?: number;

    /////////////////
    totalPrice?: number;
    discount?: number;
    totalAfterDiscount?: number;

    sum: number;
}