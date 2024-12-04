/* eslint-disable  @typescript-eslint/no-explicit-any */
import NextAuth from "next-auth";
import { NextRequest } from "next/server";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

export const GET = (req: NextRequest) => handler(req as any);

export const POST = (req: NextRequest) => handler(req as any);
