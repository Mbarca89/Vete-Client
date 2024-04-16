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

export interface provider {
    name: string;
    contactName: string;
    phone: string;
}

export interface client {
    id: string;
    name: string;
    surname: string;
    phone: string;
}

export interface pet {
    id: number;
    name: string;
    race: string;
    weight: number;
    born: date;
    photo: string | null;
}

export interface createPetformValues {
    name: string;
    race: string;
    weight: number;
    born: string;
}