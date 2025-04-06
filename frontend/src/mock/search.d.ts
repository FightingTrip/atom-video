export declare const mockSearchApi: {
    getSearchSuggestions(query: string): Promise<{
        id: string;
        text: `${string} \u6559\u7A0B` | `${string} \u5B9E\u6218` | `${string} \u5165\u95E8` | `${string} \u9AD8\u7EA7` | `${string} \u9879\u76EE`;
        type: "video" | "channel";
    }[]>;
    search(query: string, type?: string, page?: number, limit?: number): Promise<{
        results: any[];
        total: number;
        hasMore: boolean;
    }>;
};
