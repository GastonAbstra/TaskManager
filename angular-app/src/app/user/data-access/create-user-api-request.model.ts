export class CreateUserApiRequest {
    constructor(
        public readonly email: string,
        public readonly password: string
    ){}
}
