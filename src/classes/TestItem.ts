import { IEntity } from "../interfaces";
import { description } from "../types";

//https://jsonplaceholder.typicode.com/todos
export class TestItem implements IEntity {
    @description('Идентификатор')
    id: number = 0;
    @description('Идентификатор пользователя')
    userId: number = 0;
    @description('Название')
    title: string = '';
    @description('Завершённость')
    completed: boolean = false;
}