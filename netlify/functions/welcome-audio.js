export const handler = async (event, context) => {
  // CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Methods": "GET, OPTIONS"
      },
      body: ""
    };
  }

  const apiKey = process.env.ELEVENLABS_API_KEY;
  const voiceId = process.env.ELEVENLABS_VOICE_ID || '21m00Tcm4TlvDq8ikWAM';
  
  // Read text query parameter
  const params = event.queryStringParameters || {};
  const text = params.text || "Welcome to Slayzi. Systems online. Ready to automate.";

  if (!apiKey) {
    console.warn("ElevenLabs API Key not configured. Redirecting to default welcome audio.");
    return {
      statusCode: 302,
      headers: {
        "Location": "/welcome.wav"
      },
      body: ""
    };
  }

  try {
    const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': apiKey
      },
      body: JSON.stringify({
        text: text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`ElevenLabs API returned status ${response.status}: ${errorText}`);
    }

    const audioBuffer = await response.arrayBuffer();
    
    // Return base64 encoded audio binary for Netlify serverless response
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Access-Control-Allow-Origin": "*"
      },
      body: Buffer.from(audioBuffer).toString('base64'),
      isBase64Encoded: true
    };
  } catch (error) {
    console.error("ElevenLabs TTS generation failed in Netlify serverless function:", error);
    return {
      statusCode: 302,
      headers: {
        "Location": "/welcome.wav"
      },
      body: ""
    };
  }
};
