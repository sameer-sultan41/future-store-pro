"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

import Button from "@/shared/components/UI/button";
import { createSupabaseClient } from "@/shared/lib/supabaseClient";

const Login = () => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const supabase = createSupabaseClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password,
      });
      if (error) {
        setError(error.message);
        return;
      }
      if (data.session) {
        router.push("/admin");
      }
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Unknown error";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-screen justify-center items-center h-screen bg-gray-200">
      <div className="w-5/6 lg:w-[600px] p-6 rounded-lg drop-shadow-md flex flex-col gap-4 bg-white">
        <input
          type="text"
          value={loginData.email}
          className="border border-gray-200 rounded-md p-2"
          onChange={(e) => setLoginData({ ...loginData, email: e.currentTarget.value })}
        />
        <input
          type="password"
          value={loginData.password}
          className="border border-gray-200 rounded-md p-2"
          onChange={(e) => setLoginData({ ...loginData, password: e.currentTarget.value })}
        />
        <Button onClick={handleLogin} disabled={loading}>
          {loading ? "Loading..." : "Login"}
        </Button>
        <span style={{ color: "red" }}>{error}</span>
      </div>
    </div>
  );
};

export default Login;
