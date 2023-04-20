export const EditorSiRoute = "/editorsi";
export enum EditorSiElements {
  SiAdd, //Создать новое СИ 1 *
  SiBindingAdd, //Создать новую связь СИ 1 *
  SiModelAdd, //Создать новую модель СИ 1 *
  SiEdit, //Редактировать СИ 2 *
  SiBindingEdit, //Редактировать связь СИ 2 *
  SiModelEdit, //Редактировать модель СИ 2 *
}; 
 
export const elementId = (name: string): string => `${EditorSiRoute}${name}`;