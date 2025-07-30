import { TGenericErrorResponse } from "../interfaces/error.types"

/* eslint-disable @typescript-eslint/no-explicit-any */
export const handleDupliacteError = (err: any): TGenericErrorResponse => {
    const duplicate = err.message.match(/"([^*]*)"/)
    return {
        statusCode: 400,
        message: `Duplicate error at ${duplicate[1]}`
    }
}
