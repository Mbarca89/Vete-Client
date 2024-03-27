export interface userData {
    id: string;
    name: string;
    surname: string;
    userName: string;
    password: string;
    role: string;
}

export interface createUserformValues {
    id: string,
    name: string,
    surname: string,
    userName: string,
    password: string,
    repeatPassword: string,
    role: string
}

export interface userLogin {
    userName: string;
    password: string;
    remember: boolean;
}

export interface product {
    id: number;
    name: string;
    description: string;
    barCode: number;
    cost: number;
    price: number;
    stock: number;
    categoryId: number;
    categoryName: string;
    seller: string;
    provider: string;
    image: string | null;
}

export interface createProductformValues {
    name: string;
    description: string;
    barCode: number;
    cost: number;
    price: number;
    stock: number;
    categoryName: string;
    provider: string;
}