import { Hono } from "hono";
import { handle } from "hono/vercel";

import { authRouter } from "@/features/accounts/server/route";
import { lessonsRouter } from "@/features/lessons/server/route";

const app = new Hono().basePath("/api").route("/accounts", authRouter).route("/lessons", lessonsRouter);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof app;
