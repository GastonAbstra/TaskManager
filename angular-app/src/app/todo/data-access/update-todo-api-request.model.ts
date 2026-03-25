export class UpdateTodoApiRequestModel {
  constructor(
    public readonly id: string,
    public readonly userId: number,
    public readonly title: string,
    public readonly completed: boolean
  ) {}
}
