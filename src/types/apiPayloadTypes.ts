export interface signupPayload {
    name:string;
    email:string;
    password:string;
    role:'individual' | 'pet_shop' | 'shelter';
}
export interface loginPayload {
    email:string;
    password:string;
}