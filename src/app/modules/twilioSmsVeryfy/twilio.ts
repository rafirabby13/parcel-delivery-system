/* eslint-disable @typescript-eslint/no-explicit-any */
// twilio.js
import twilio from 'twilio';
import { envVars } from '../../config/env';
import AppError from '../../errorHelpers/AppError';

const client = twilio(envVars.TWILIO_SID, envVars.TWILIO_AUTH_TOKEN);
// const verifySid = process.env.TWILIO_VERIFY_SERVICE_SID!;

export const sendOTP = async () => {
    try {
        const response = await client.messages
            .create({
                body: 'Hello from twilio-node',
                to: envVars.TWILIO_NUMBER, // Text your number
                from: '+12025551234', // From a valid Twilio number
            })

        console.log(response)

    } catch (error: any) {
        throw new AppError(404, error.message)
    }
};

// export const verifyOTP = async (phone: string, code: string) => {
//     return client.verify.v2.services(verifySid)
//         .verificationChecks
//         .create({ to: phone, code });
// };
