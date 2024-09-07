export interface Recado {
    id: string;
    description: string;
    detail: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    recados: Recado[];
};

export interface ResponseAPI {
    success: boolean;
    message: string;
    data: any;
}