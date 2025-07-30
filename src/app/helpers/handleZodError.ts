/* eslint-disable @typescript-eslint/no-explicit-any */
import { TGenericErrorResponse } from "../interfaces/error.types";

export const handlZodError = (err: any): TGenericErrorResponse => {
    const errorSources: any = []


    err.issues?.forEach((issue: any) => {
        errorSources.push({
            path: issue.path[0],
            message: issue.message
        })
    });

    return {
        statusCode: 400,
        message: "Zod Error",
        errorSources
    }
}