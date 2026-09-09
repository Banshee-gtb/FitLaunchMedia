import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAdminSession } from "@/lib/adminAuth";

export function useAdminGuard() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!getAdminSession()) {
      navigate("/admin", { replace: true });
    }
  }, [navigate]);

  return getAdminSession();
}
