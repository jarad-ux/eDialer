import Anthropic from '@anthropic-ai/sdk'

const apiKey = process.env.ANTHROPIC_API_KEY

if (!apiKey) {
  console.warn('Anthropic API key not configured')
}

export const anthropic = apiKey ? new Anthropic({ apiKey }) : null

export async function analyzeCallTranscript(transcript: string) {
  if (!anthropic) {
    throw new Error('Anthropic not configured')
  }

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: `Analyze this call transcript and provide:
1. A brief summary (2-3 sentences)
2. Sentiment (positive, negative, neutral)
3. Key action items or follow-ups
4. Recommended call outcome

Transcript:
${transcript}`,
      },
    ],
  })

  return message.content[0].type === 'text' ? message.content[0].text : ''
}

export async function generateCallScript(context: {
  contactName: string
  company?: string
  purpose: string
  notes?: string
}) {
  if (!anthropic) {
    throw new Error('Anthropic not configured')
  }

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: `Generate a professional phone call script for the following context:
- Contact: ${context.contactName}${context.company ? ` at ${context.company}` : ''}
- Purpose: ${context.purpose}
${context.notes ? `- Notes: ${context.notes}` : ''}

Provide a natural, conversational script with key talking points.`,
      },
    ],
  })

  return message.content[0].type === 'text' ? message.content[0].text : ''
}
