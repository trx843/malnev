export type ResponseFAQFilesType = Array<FAQFileItemsType>;

export type FAQFileItemsType = {
    typeId: number;
    typeName: string;
    items: Array<FAQFileType>;
};

export type FAQFileType = {
    id: number | string;
    fileName: string;
    disabled?: boolean;
};

export type FileResponseType = {
    success: boolean;
    message: string;
    result: FAQFileType;
};

export type DocTypesResponseType = {
    id: number;
    description: string;
    showInFaq: boolean;
};