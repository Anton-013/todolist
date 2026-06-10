import { baseApi } from "@/app/baseApi"
import { CaptchaUrlResponse } from "./captchaApi.types"

export const captchaApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        getCaptchaUrl: build.query<CaptchaUrlResponse, void>({
            query: () => "security/get-captcha-url",
        }),
    }),
})

export const {
    useGetCaptchaUrlQuery
} = captchaApi

