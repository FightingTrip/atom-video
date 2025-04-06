// API 错误类
export class ApiError extends Error {
    constructor(message, status, code = '', data = null) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.code = code;
        this.data = data;
    }
}
//# sourceMappingURL=types.js.map