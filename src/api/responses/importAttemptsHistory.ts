export type FilterDocumentType = {
    id: number,
    docType: string,
};

export type FilterStatusType = {
    id: number,
    name: string,
}

export type HistoryResponseType = {
    entities: Array<HistoryRowType>,
    pageInfo: PageInfoType,
}

export type HistoryRowType = {
    id: string,
    docType: string,
    fileName: string,
    timeStamp: Date,
    importStatus: string,
    messagesCount: number,
    userName: string,
}

export type PageInfoType = {
    pageNumber: number,
    pageSize: number,
    totalItems: number,
    totalPages: number,
    fileName: string,
    userName: string,
    timeStamp: string,
}

export type CardResponseType = {
    entities: Array<AttemptRowType>,
    pageInfo: PageInfoType,
}

export type AttemptRowType = {
    rowNumber: number,
    timeStamp: Date,
    message: string,
    status: boolean,
}

export type MessageType = {
    id: string,
    nodeId: number,
    title: string,
    key: string,
    type: string,
    children: Array<MessageType>,
    owned: boolean,
    isSiType: boolean,
}

export type AttemptHeadType = {
    userName: string,
    timeStamp: string,
    fileName: string,
}