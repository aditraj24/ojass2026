import { jwtVerify } from "jose";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const adminToken = request.cookies.get("admin_token")?.value;

    const redirectHome = () => {
        const res = NextResponse.redirect(new URL("/", request.url));
        res.cookies.delete("admin_token");
        return res;
    };

    if (pathname.startsWith("/dashboard")) {
        if (!adminToken) return redirectHome();

        const secret = process.env.JWT_SECRET;
        if (!secret) throw new Error("JWT_SECRET is not defined");

        try {
            const { payload } = await jwtVerify(
                adminToken,
                new TextEncoder().encode(secret)
            );

            if (payload.role !== "admin") return redirectHome();

            return NextResponse.next();
        } catch (error) {
            console.error("Token verification failed:", error);
            return redirectHome();
        }
    }

    if (pathname === "/" && adminToken)
        return NextResponse.redirect(new URL("/dashboard", request.url));

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
