export const FAQRoute = "/FAQ";
export enum FAQElements {
    AddFile, //Добавить файл  1
};

export const elementId = (name: string): string => `${FAQRoute}${name}`;