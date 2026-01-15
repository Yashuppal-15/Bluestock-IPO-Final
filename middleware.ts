import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    // Middleware logic here if needed
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/admin/login",
    },
  }
);

// Protect all admin routes
export const config = {
  matcher: ["/admin/dashboard/:path*", "/admin/create/:path*", "/admin/upload/:path*"],
};
