// pages/auth/signin.tsx

import { useNavigate } from "react-router-dom";
import { LoginForm } from "@/components/login-form";

export default function SignIn() {
  const navigate = useNavigate();

  const handleSignIn = (userId: string) => {
    navigate(`/dashboard?userId=${userId}`);
  };

  return (
    <div className="flex w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm onSignIn={handleSignIn} />
      </div>
    </div>
  );
}
