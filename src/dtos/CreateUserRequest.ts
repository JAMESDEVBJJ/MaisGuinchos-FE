export type CreateUserRequest = {
    name: string;
    userName: string;
    cpf: string;
    numeroTelefone: string;
    email: string;
    password: string;
    confirmPass: string; 
    tipo: number;
    guincho?: CreateGuinchoDTO;
};

export type CreateGuinchoDTO = {
    modelo: string;
    cor: string;
    placa: string;
    cnh?: string;
}