import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/admin/login", // redirect if not logged in
  },
});

export const config = {
  matcher: ["/admin/:path*"], // protect all /admin routes
};
