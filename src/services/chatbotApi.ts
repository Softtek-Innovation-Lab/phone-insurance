import axios from 'axios';

const CHATBOT_API_URL = 'https://app-aiback-uat.azurewebsites.net/api';
const AGENT_ID = '87c89cdc-82d5-45ab-bebb-4e5981aed1d7';
const LOGIN_EMAIL = 'facundo.curti@softtek.com';
const LOGIN_PASSWORD = 'facundo123';

interface LoginResponse {
    access_token: string;
    token_type: string;
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
     * Send a prompt to the chatbot with streaming
     */
    async sendPrompt(message: string, onChunk?: (chunk: string) => void): Promise<string> {
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
            formData.append('stream', 'true');
            formData.append('session_id', sessionId);

            console.log('Sending message to chatbot:', message);
            console.log('Session ID:', sessionId);

            // Use fetch for streaming support
            const response = await fetch(
                `${CHATBOT_API_URL}/chat/prompt?agent_id=${AGENT_ID}`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: formData
                }
            );

            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    // Try to re-login
                    console.log('Unauthorized, attempting to re-login...');
                    localStorage.removeItem('chatbot_token');
                    const newToken = await this.login();
                    if (newToken) {
                        // Retry the request
                        const retryFormData = new FormData();
                        retryFormData.append('content', message);
                        retryFormData.append('stream', 'true');
                        retryFormData.append('session_id', sessionId);

                        const retryResponse = await fetch(
                            `${CHATBOT_API_URL}/chat/prompt?agent_id=${AGENT_ID}`,
                            {
                                method: 'POST',
                                headers: {
                                    'Authorization': `Bearer ${newToken}`
                                },
                                body: retryFormData
                            }
                        );

                        if (!retryResponse.ok) {
                            throw new Error(`HTTP error! status: ${retryResponse.status}`);
                        }

                        return this.processStreamingResponse(retryResponse, onChunk);
                    }
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return this.processStreamingResponse(response, onChunk);
        } catch (error: any) {
            console.error('Chatbot API error:', error);
            const errorMessage = error.message || 'Failed to send message to chatbot';
            throw new Error(errorMessage);
        }
    },

    /**
     * Process streaming response from SSE
     */
    async processStreamingResponse(response: Response, onChunk?: (chunk: string) => void): Promise<string> {
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let fullResponse = '';
        let currentSessionId = '';

        if (!reader) {
            throw new Error('No response body');
        }

        try {
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6); // Remove 'data: ' prefix
                        
                        try {
                            const parsed = JSON.parse(data);
                            
                            // Handle text delta events
                            if (parsed.type === 'response.output_text.delta' && parsed.content) {
                                fullResponse += parsed.content;
                                if (onChunk) {
                                    onChunk(parsed.content);
                                }
                            }
                            
                            // Handle session creation
                            if (parsed.type === 'response.created' && parsed.session_id) {
                                currentSessionId = parsed.session_id;
                            }
                            
                            // Handle completion
                            if (parsed.type === 'response.completed') {
                                if (parsed.session_id) {
                                    currentSessionId = parsed.session_id;
                                }
                            }
                        } catch (e) {
                            // Skip malformed JSON
                            console.warn('Failed to parse SSE data:', data);
                        }
                    }
                }
            }

            // Save session_id for future messages
            if (currentSessionId) {
                localStorage.setItem('chatbot_session_id', currentSessionId);
                console.log('Session ID saved:', currentSessionId);
            }

            console.log('Full chatbot response:', fullResponse);
            return fullResponse || 'No response from chatbot';
        } catch (error) {
            console.error('Error processing stream:', error);
            throw error;
        } finally {
            reader.releaseLock();
        }
    }
};
