import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { query } = await request.json();

    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // This matches the -e MY_LLM_API_KEY you used in your docker command
        'Authorization': `Bearer ${process.env.MY_LLM_API_KEY}` 
      },
      body: JSON.stringify({
        model: "meta-llama/llama-4-scout-17b-16e-instruct", // You can also use "mixtral-8x7b-32768" or "llama3-70b-8192"
        messages: [
          {
            role: "system",
            content: "You are a helpful AI chef. You must return your response ONLY as a valid JSON object matching this exact structure: {\"title\": \"Recipe Name\", \"ingredients\": [\"item 1\", \"item 2\"], \"steps\": [\"step 1\", \"step 2\"], \"isAiGenerated\": true, \"sourceUrl\": \"\"}. Do not include markdown backticks or any outside text."
          },
          {
            role: "user",
            content: `Invent a delicious recipe using these ingredients and context: "${query}".`
          }
        ],
        response_format: { type: "json_object" }, // Forces the model to return valid JSON
        temperature: 0.7
      })
    });

    if (!groqResponse.ok) {
        const errorText = await groqResponse.text();
        console.error("Groq API Error Details:", errorText);
        throw new Error(`Groq API responded with status: ${groqResponse.status}`);
    }

    const data = await groqResponse.json();
    
    // Parse the JSON string returned by Groq into a JavaScript object
    const recipeData = JSON.parse(data.choices[0].message.content);

    return NextResponse.json(recipeData);
    
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Failed to generate recipe" }, { status: 500 });
  }
}