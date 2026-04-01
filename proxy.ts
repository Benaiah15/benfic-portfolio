import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/admin/login", // Redirect unauthorized users here
  },
});

// Specify exactly which routes need protection
export const config = {
  matcher: [
    "/admin/:path*",      // Protects the dashboard UI
    "/api/projects/:path*", // Protects the database write/delete actions
    "/api/upload/:path*"    // Protects your image upload endpoint
  ], 
};