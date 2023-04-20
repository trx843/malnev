import { description } from '../types';

export class AlgHistory {
  id: string;
  algorithm_ID: string = '';
  @description('Начало интервала')
  startTime: Date = new Date();
  @description('Конец интервала')
  endTime: Date = new Date();
  @description('Создание')
  createTime: Date = new Date();
  @description('Начало выполнения')
  runTime: Date = new Date();
  @description('Конец выполнения')
  finishTime: Date = new Date();
  @description('Сервер')
  host: string = '';
  status: number;
  @description('Статус')
  statusText: string = '';
  @description('Сообщение')
  message: string = '';
  recalculation: boolean;
}
