export class CreateTodoApiRequestModel {
  constructor(
    public readonly userId: number,
    public readonly title: string
  ){}
}
