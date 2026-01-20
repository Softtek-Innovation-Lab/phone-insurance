import axios from 'axios';

const CHATBOT_API_URL = 'https://app-aiback-uat.azurewebsites.net/api';
const AGENT_ID = '87c89cdc-82d5-45ab-bebb-4e5981aed1d7';
const LOGIN_EMAIL = 'facundo.curti@softtek.com';
const LOGIN_PASSWORD = 'facundo123';

interface LoginResponse {
    access_token: string;
    token_type: string;
}

interface AssistantMessage {
    content: string;
    role: string;
    type: string;
    tool_name: string | null;
    token_usage: any;
    id: string;
    session_id: string;
    user_id: string;
    timestamp: string;
    message_order: number;
    files: any[];
}

interface ChatResponse {
    user_message: any;
    assistant_message: AssistantMessage;
    session_id: string;
    created_new_session: boolean;
    session_tokens: any;
}

export const chatbotService = {
    /**
     * Login to get the Bearer token for chatbot API
     */
    async login(): Promise<string | null> {
        try {
            const response = await axios.post<LoginResponse>(
                `${CHATBOT_API_URL}/auth/login`,
                {
                    email: LOGIN_EMAIL,
                    password: LOGIN_PASSWORD
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.access_token) {
                localStorage.setItem('chatbot_token', response.data.access_token);
                console.log('Login successful');
                return response.data.access_token;
            }
            
            return null;
        } catch (error) {
            console.error('Chatbot login failed:', error);
            return null;
        }
    },

    /**
     * Send a prompt to the chatbot
     */
    async sendPrompt(message: string): Promise<string> {
        try {
            // Ensure we have a token
            let token = localStorage.getItem('chatbot_token');
            if (!token) {
                token = await this.login();
                if (!token) {
                    throw new Error('Failed to authenticate');
                }
            }

            // Get session_id from localStorage (empty for first message)
            const sessionId = localStorage.getItem('chatbot_session_id') || '';

            // Create FormData for multipart/form-data request
            const formData = new FormData();
            formData.append('content', message);
            formData.append('stream', 'false');
            formData.append('session_id', sessionId);

            console.log('Sending message to chatbot:', message);
            console.log('Session ID:', sessionId);

            const response = await axios.post<ChatResponse>(
                `${CHATBOT_API_URL}/chat/prompt?agent_id=${AGENT_ID}`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                        // Content-Type will be set automatically by axios for FormData
                    }
                }
            );

            console.log('Chatbot response:', response.data);

            // Save session_id for future messages
            if (response.data.session_id) {
                localStorage.setItem('chatbot_session_id', response.data.session_id);
                console.log('Session ID saved:', response.data.session_id);
            }

            // Return the assistant's message
            const assistantResponse = response.data.assistant_message?.content;
            if (!assistantResponse) {
                console.error('No assistant message in response:', response.data);
                throw new Error('No response content from chatbot');
            }

            return assistantResponse;
        } catch (error: any) {
            // If unauthorized, try to re-login once
            if (error.response?.status === 401 || error.response?.status === 403) {
                console.log('Unauthorized, attempting to re-login...');
                localStorage.removeItem('chatbot_token');
                const newToken = await this.login();
                if (newToken) {
                    // Retry the request
                    try {
                        const sessionId = localStorage.getItem('chatbot_session_id') || '';
                        const formData = new FormData();
                        formData.append('content', message);
                        formData.append('stream', 'true');
                        formData.append('session_id', sessionId);

                        const response = await axios.post<ChatResponse>(
                            `${CHATBOT_API_URL}/chat/prompt?agent_id=${AGENT_ID}`,
                            formData,
                            {
                                headers: {
                                    'Authorization': `Bearer ${newToken}`
                                }
                            }
                        );

                        if (response.data.session_id) {
                            localStorage.setItem('chatbot_session_id', response.data.session_id);
                        }

                        return response.data.assistant_message?.content || 'No response from chatbot';
                    } catch (retryError: any) {
                        console.error('Chatbot retry failed:', retryError);
                        console.error('Retry error response:', retryError.response?.data);
                        throw new Error('Failed to communicate with chatbot after retry');
                    }
                }
            }
            
            console.error('Chatbot API error:', error);
            console.error('Error message:', error.message);
            if (error.response) {
                console.error('Response data:', error.response.data);
                console.error('Response status:', error.response.status);
                console.error('Response headers:', error.response.headers);
            }
            
            const errorMessage = error.response?.data?.detail || error.response?.data?.message || error.message || 'Failed to send message to chatbot';
            throw new Error(errorMessage);
        }
    }
};
