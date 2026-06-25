export async function ttsHandler(req, res) {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  const voiceId = process.env.ELEVENLABS_VOICE_ID || '21m00Tcm4TlvDq8ikWAM'; // Rachel (pre-made voice)
  const text = req.query.text || "Welcome to Slayzi. Systems online. Ready to automate.";

  if (!apiKey) {
    console.warn("ElevenLabs API Key not configured. Redirecting to default welcome audio.");
    return res.redirect('/welcome.wav');
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
    res.setHeader('Content-Type', 'audio/mpeg');
    res.send(Buffer.from(audioBuffer));
  } catch (error) {
    console.error("ElevenLabs TTS generation failed:", error);
    // Graceful fallback to welcome.wav
    res.redirect('/welcome.wav');
  }
}
