import { Client as WorflowClient } from "@upstash/workflow";
import { QSTASH_TOKEN,QSTASH_URL } from "./env.js";

export const worflowClient = new WorflowClient({
    baseUrl: QSTASH_URL,
    token: QSTASH_TOKEN,
})