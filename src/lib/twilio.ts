import twilio from 'twilio'

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN

if (!accountSid || !authToken) {
  console.warn('Twilio credentials not configured')
}

export const twilioClient = accountSid && authToken
  ? twilio(accountSid, authToken)
  : null

export const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER

export async function makeCall(to: string, options?: {
  statusCallback?: string
  machineDetection?: 'Enable' | 'DetectMessageEnd'
}) {
  if (!twilioClient || !twilioPhoneNumber) {
    throw new Error('Twilio not configured')
  }

  return twilioClient.calls.create({
    to,
    from: twilioPhoneNumber,
    ...options,
  })
}

export async function getCallDetails(callSid: string) {
  if (!twilioClient) {
    throw new Error('Twilio not configured')
  }

  return twilioClient.calls(callSid).fetch()
}
