import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(req: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return NextResponse.next();
  }

  // login route is always public
  if (req.nextUrl.pathname === "/admin/login") {
    return NextResponse.next();
  }

  let res = NextResponse.next({ request: req });

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return req.cookies.getAll();
      },
      setAll(cookiesToSet) {
        // Update request cookies so downstream middleware/routes see fresh tokens
        cookiesToSet.forEach(({ name, value }) =>
          req.cookies.set(name, value),
        );
        // Recreate response to carry updated request cookies
        res = NextResponse.next({ request: req });
        // Set cookies on the response so the browser stores them
        cookiesToSet.forEach(({ name, value, options }) =>
          res.cookies.set(name, value, options),
        );
      },
    },
  });

  // getUser() validates JWT with Supabase server — more secure than getSession()
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");

  if (isAdminRoute && !user) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = "/admin/login";
    redirectUrl.searchParams.set("redirectTo", req.nextUrl.pathname);
    const redirectRes = NextResponse.redirect(redirectUrl);
    // Copy any refreshed auth cookies to the redirect response
    res.cookies.getAll().forEach((cookie) => {
      redirectRes.cookies.set(cookie.name, cookie.value);
    });
    return redirectRes;
  }

  return res;
}

export const config = {
  matcher: ["/admin/:path*"],
};
