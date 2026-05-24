// Тип для создания объекта (POST)
export interface PostObjectRequestBody {
    name: string;
    age: number;
    status?: string; // Знак ? означает, что поле необязательное
}

// Тип для обновления объекта (PUT)
export interface PutObjectRequestBody {
    name: string;
    age: number;
    status?: string;
}
