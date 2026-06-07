import { Navigate } from "react-router-dom";
import { useAppSelector } from "../store";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
   const { token } = useAppSelector((state) => state.auth);

   if (!token) {
      return <Navigate to="/login" replace />;
   }

   return <>{children}</>;
};

export default ProtectedRoute;
