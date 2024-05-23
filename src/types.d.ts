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
    providerName: string;
    stockAlert: boolean;
    published: boolean;
    image: string | null;
}

export interface createProductformValues {
    name: string;
    description: string;
    barCode: number | undefined;
    cost: number | undefined;
    price: number | undefined;
    stock: number | undefined;
    categoryName: string;
    providerName: string;
}

export interface provider {
    id: string;
    name: string;
    contactName: string;
    phone: string;
}

export interface client {
    id: string;
    name: string;
    surname: string;
    phone: string;
    email: string;
    social: string;
    userName: string;
}

export interface pet {
    id: string;
    name: string;
    race: string;
    gender: string;
    species: string;
    weight: number;
    born: date;
    photo: string | null;
    ownerName: string;
}

export interface createPetformValues {
    name: string;
    race: string;
    gender: string;
    species: string;
    weight: number;
    born: string;
}

export interface medicalHistory {
    id: string;
    date: date;
    type: string;
    notes: string;
    description: string;
    medicine: string;
}

export interface createMedicalHistoryFormValues {
    date: string;
    type: string;
    notes: string;
    description: string;
    medicine: string;
}

export interface CreateVaccineformValues {
    id: string;
    name: string;
    date: string;
    notes: string;
    petId: string;
}

export interface events {
    title: string,
    start: string,
    end: string,
}

export interface saleProduct {
    saleId: string,
    productId: number,
    productName: string,
    productDescription: string,
    productPrice: number,
    productCost: number,
    quantity: number
}

export interface sale {
    id: string,
    amount: number,
    cost: number,
    date: string,
    seller: string,
    saleProducts: saleProduct[]
}

export interface order {
    id: string,
    amount: number,
    cost: number,
    date: string,
    orderProducts: orderProduct[]
}

export interface orderProduct {
    orderId: string,
    productId: number,
    productName: string,
    productDescription: string,
    productPrice: number,
    productCost: number,
    quantity: number
}

export interface reminder {
    name: string;
    notes: string;
    petName: string;
    date: date;
}

export interface CreateReminderformValues {
    id: string;
    name: string;
    date: string;
    notes: string;
    phone: string;
}

export interface stockAlert {
    productName: string,
    stock: number
}

export interface message {
    clientName: string;
    clientPhone: string;
    petName: string;
    vaccineName: string;
    sent: boolean;
}

export interface saleReport {
    totalAmount: number;
    totalCost: number;
    payments: number;
}

export interface saleByCategoryReport {
    categoryName: string;
    totalAmount: number;
}

export interface payments {
    id: string,
    date: date,
    billNumber: string,
    amount: number,
    provider: string,
    payed: boolean,
    paymentMethod: string,
    paymentDate: date
}
