import { useState } from 'react';
import { Groq } from 'groq-sdk';
import { API_KEY } from '../config/apikey';
import './Chatbot.css';

const groq = new Groq({ apiKey: API_KEY, dangerouslyAllowBrowser: true });

export default function Chatbot() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = { role: 'user', content: input }; // Groq uses 'content', not 'text'
        setMessages(prev => [...prev, { role: 'user', text: input }]); // Keep 'text' for rendering consistency or update rendering to check 'content' or 'text'
        setInput('');
        setLoading(true);
        setError(null);

        try {
            const chatCompletion = await groq.chat.completions.create({
                messages: [
                    {
                        role: "user",
                        content: input
                    }
                ],
                model: "openai/gpt-oss-120b",
                temperature: 1,
                max_completion_tokens: 8192,
                top_p: 1,
                stream: true,
                reasoning_effort: "medium",
                stop: null
            });

            let fullResponse = "";
            // Add an empty model message to start accumulating
            setMessages(prev => [...prev, { role: 'model', text: "" }]);

            for await (const chunk of chatCompletion) {
                const content = chunk.choices[0]?.delta?.content || '';
                fullResponse += content;

                // Update the last message with the accumulated text
                setMessages(prev => {
                    const newMessages = [...prev];
                    const lastMsg = newMessages[newMessages.length - 1];
                    lastMsg.text = fullResponse;
                    return newMessages;
                });
            }

        } catch (error) {
            console.error("Error generating content:", error);
            setError(error.message || "An error occurred");
            setMessages(prev => [...prev, { role: 'model', text: "Error: " + (error.message || "Could not generate response.") }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="chatbot-container">
            <div className="chat-window">
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.role}`}>
                        <strong>{msg.role === 'user' ? 'You' : 'Groq'}:</strong> {msg.text}
                    </div>
                ))}
                {loading && messages.length > 0 && messages[messages.length - 1].role === 'user' && (
                    <div className="message model"><em>Starting...</em></div>
                )}
                {error && <div className="message error" style={{ color: 'red' }}>Error: {error}</div>}
            </div>
            <div className="input-area">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Ask me anything..."
                />
                <button onClick={sendMessage} disabled={loading && messages.length > 0 && messages[messages.length - 1].role !== 'model'}>Send</button>
            </div>
        </div>
    );
}
