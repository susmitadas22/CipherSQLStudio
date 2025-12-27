const axios = require('axios');

const LLM_PROVIDER = process.env.LLM_PROVIDER || 'openai';

const generateHint = async (assignmentQuestion, userQuery, previousHints = []) => {
  try {
    const systemPrompt = `You are a helpful SQL tutor. Your role is to provide HINTS, not complete solutions.
    
IMPORTANT RULES:
- NEVER provide the complete SQL query
- Give conceptual guidance and direction
- Suggest which SQL clauses or functions to consider
- Point out common mistakes without fixing them
- Ask leading questions to help the student think
- Be encouraging and educational

If the student seems very stuck, provide slightly more specific hints, but still not the full answer.`;

    const userPrompt = `Assignment Question: ${assignmentQuestion}

Student's Current Query: ${userQuery || 'No query written yet'}

${previousHints.length > 0 ? `Previous hints given: ${previousHints.join(', ')}` : ''}

Provide a helpful hint (not the solution) to guide the student.`;

    let hintText = '';

    if (LLM_PROVIDER === 'openai') {
      hintText = await getOpenAIHint(systemPrompt, userPrompt);
    } else if (LLM_PROVIDER === 'gemini') {
      hintText = await getGeminiHint(systemPrompt, userPrompt);
    } else {
      throw new Error('Invalid LLM provider specified');
    }

    return hintText;
  } catch (error) {
    console.error('Error generating hint:', error.message);
    throw new Error('Failed to generate hint. Please try again.');
  }
};

const getOpenAIHint = async (systemPrompt, userPrompt) => {
  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: 500,
      temperature: 0.7,
    },
    {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data.choices[0].message.content.trim();
};

const getGeminiHint = async (systemPrompt, userPrompt) => {
  const response = await axios.post(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      contents: [{
        parts: [{
          text: `${systemPrompt}\n\n${userPrompt}`,
        }],
      }],
      generationConfig: {
        maxOutputTokens: 500,
        temperature: 0.7,
      },
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data.candidates[0].content.parts[0].text.trim();
};

module.exports = {
  generateHint,
};
