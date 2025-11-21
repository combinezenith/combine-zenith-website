import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: { signIn: "/admin/login" },
  callbacks: {
    authorized: ({ token }) => {
      // Only allow admin role
      return token?.role === "admin";
    },
  },
});

export const config = {
  matcher: ["/admin/:path*"], // protects all /admin routes
};
