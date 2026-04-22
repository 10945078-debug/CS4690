export interface Course {
    id: string;
    display: string;
}

export interface Log {
    id: string;
    courseId: string;
    uvuId: string;
    date: string;
    text: string;
}

export type LogCreate = Omit<Log, 'id'>;