import { forwardRef } from "react";
import { Link, type LinkProps } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

/**
 * The conversion path: signed out goes to /signup, signed in goes to /dashboard.
 * Only the link target changes; the children (the frozen copy) are the caller's.
 */
const AuthCta = forwardRef<HTMLAnchorElement, Omit<LinkProps, "to">>((props, ref) => {
  const { isAuthenticated } = useAuth();
  return <Link ref={ref} to={isAuthenticated ? "/dashboard" : "/signup"} {...props} />;
});
AuthCta.displayName = "AuthCta";

export default AuthCta;
