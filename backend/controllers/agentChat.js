export const agentChatHandler = async (req, res) => {
    try {
        const { userMessage, userSessionId } = req.body;

        // Directly hitting your live n8n production webhook URL
        const response = await fetch('http://localhost:5678/webhook/client-intake', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({
                chatInput: userMessage,
                sessionId: userSessionId || 'default_session'
            })
        });

        const data = await response.json();
        
        // Extract the response string text coming from your n8n AI Agent node
        const aiResponseText = data.output || data[0]?.output || "Processing error.";

        // Return it cleanly back to your frontend custom styles
        return res.status(200).json({ text: aiResponseText });

    } catch (error) {
        console.error("Startup Backend Error:", error);
        return res.status(500).json({ error: "Could not establish connection to the automation core." });
    }
};
