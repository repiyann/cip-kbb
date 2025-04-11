export interface Message {
    id: string;
    text: string;
    displayText?: string;
    sender: 'user' | 'assistant';
    timestamp: Date;
}

export interface FireworksRequest {
    model: string;
    max_tokens: number;
    top_p: number;
    top_k: number;
    presence_penalty: number;
    frequency_penalty: number;
    temperature: number;
    messages: {
        role: string;
        content: string;
    }[];
}

export interface FireworksResponse {
    id: string;
    object: string;
    created: number;
    model: string;
    choices: {
        index: number;
        message: {
            role: string;
            content: string;
        };
        finish_reason: string;
    }[];
    usage: {
        prompt_tokens: number;
        total_tokens: number;
        completion_tokens: number;
    };
}
