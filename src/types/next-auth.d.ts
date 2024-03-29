/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Session, User } from "next-auth";
import type { JWT } from "next-auth/jwt";

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        username?: string | null;
    }
}

declare module "next-auth" {
    interface Session {
        user: User;
    }
    interface User {
        id: string;
        username?: string | null;
    }
}
