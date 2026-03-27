"use client";

import { AuthProvider } from "@/lib/auth-context";
import { useAuth } from "@/lib/auth-context";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Phone, Mail, ArrowRight, Loader2, User, Wrench, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

type AuthMode = "role" | "phone" | "verify" | "details";

function AuthPageContent() {
  const router = useRouter();
  const { login, verifyOTP, signup, resendOTP, isAuthenticated, isLoading: authLoading } = useAuth();
  const [mode, setMode] = useState<AuthMode>("role");
  const [selectedRole, setSelectedRole] = useState<"USER" | "PROVIDER">("USER");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(0);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-bg-main flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isAuthenticated) {
    const { user } = useAuth();
    if (user?.role === 'PROVIDER') {
      router.push("/worker/home");
    } else {
      router.push("/home");
    }
    return null;
  }

  const bdPhone = phone.startsWith("0") ? phone : phone ? "0" + phone : "";

  const handleRoleSelect = (role: "USER" | "PROVIDER") => {
    setSelectedRole(role);
    setMode("phone");
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length !== 11) {
      setError("১১ ডিজিটের ফোন নম্বর দিন");
      return;
    }
    if (!phoneDigits.startsWith('01')) {
      setError("০১XXXXXXXXX ফরম্যাটে দিন");
      return;
    }
    setError("");
    setIsLoading(true);

    try {
      await login(bdPhone);
      setMode("verify");
      setResendTimer(30);
    } catch (err: any) {
      if (err.message.includes("not found") || err.message.includes("404")) {
        setMode("details");
      } else {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 4) {
      setError("সঠিক OTP দিন");
      return;
    }
    setError("");
    setIsLoading(true);

    try {
      await verifyOTP(bdPhone, otp);
      if (selectedRole === "PROVIDER") {
        router.push("/worker/home");
      } else {
        router.push("/home");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("নাম দিন");
      return;
    }
    setError("");
    setIsLoading(true);

    try {
      await signup({ name, email, phone: bdPhone, role: selectedRole });
      await login(bdPhone);
      setMode("verify");
      setResendTimer(30);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await resendOTP(bdPhone);
      setResendTimer(30);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-soft to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {mode !== "role" && (
          <button
            onClick={() => {
              if (mode === "phone") setMode("role");
              else if (mode === "verify") setMode("phone");
              else if (mode === "details") setMode("phone");
            }}
            className="flex items-center gap-2 text-text-secondary mb-6 hover:text-primary"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">পেছনে</span>
          </button>
        )}

        <motion.div
          key={mode}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-4xl">🔧</span>
            </div>
            <h1 className="text-2xl font-bold text-text-primary">
              {mode === "role" && "কাজ লাগবে"}
              {mode === "phone" && (selectedRole === "PROVIDER" ? "সেবা দিতে" : "সেবা নিতে")}
              {mode === "verify" && "যাচাই করুন"}
              {mode === "details" && "নতুন অ্যাকাউন্ট"}
            </h1>
            <p className="text-text-secondary mt-2">
              {mode === "role" && "আপনি কী করতে চান?"}
              {mode === "phone" && "আপনার ফোন নম্বর দিন"}
              {mode === "verify" && `${bdPhone} নম্বরে OTP পাঠানো হয়েছে`}
              {mode === "details" && "কিছু তথ্য দিন"}
            </p>
          </div>

          <Card className="border-0 shadow-xl">
            <CardContent className="p-6">
              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm">
                  {error}
                </div>
              )}

              {mode === "role" && (
                <div className="space-y-4">
                  <button
                    onClick={() => handleRoleSelect("USER")}
                    className="w-full p-5 rounded-2xl border-2 border-gray-100 hover:border-primary hover:bg-primary-soft transition-all text-left group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                        <Search className="w-7 h-7 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-lg font-semibold text-text-primary">সেবা নিতে চাই</p>
                        <p className="text-sm text-text-secondary">বুকিং করুন, সার্ভিস পান</p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-text-muted group-hover:text-primary transition-colors" />
                    </div>
                  </button>

                  <button
                    onClick={() => handleRoleSelect("PROVIDER")}
                    className="w-full p-5 rounded-2xl border-2 border-gray-100 hover:border-primary hover:bg-primary-soft transition-all text-left group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                        <Wrench className="w-7 h-7 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-lg font-semibold text-text-primary">সেবা দিতে চাই</p>
                        <p className="text-sm text-text-secondary">কাজ নিন, আয় করুন</p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-text-muted group-hover:text-primary transition-colors" />
                    </div>
                  </button>
                </div>
              )}

              {mode === "phone" && (
                <form onSubmit={handleSendOTP}>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      ফোন নম্বর
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                      <Input
                        type="tel"
                        placeholder="০১XXXXXXXXX"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 11))}
                        className="pl-10 h-14 text-lg"
                        maxLength={11}
                        required
                      />
                    </div>
                    <div className="flex justify-between mt-1">
                      <p className="text-xs text-text-muted">
                        ১১ ডিজিটের ফোন নম্বর দিন
                      </p>
                      <p className={`text-xs ${phone.length === 11 ? 'text-success' : 'text-text-muted'}`}>
                        {phone.length}/11
                      </p>
                    </div>
                  </div>
                  <Button type="submit" className="w-full h-14 text-lg" disabled={isLoading}>
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        এগিয়ে যান <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>
                </form>
              )}

              {mode === "verify" && (
                <form onSubmit={handleVerifyOTP}>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      ৬ সংখ্যার OTP
                    </label>
                    <Input
                      type="text"
                      placeholder="XXXXXX"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      className="h-14 text-center text-xl tracking-widest"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full h-14 text-lg mb-4" disabled={isLoading}>
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      "যাচাই করুন"
                    )}
                  </Button>
                  <div className="text-center">
                    {resendTimer > 0 ? (
                      <p className="text-sm text-text-muted">
                        {resendTimer} সেকেন্ড পরে আবার চেষ্টা করুন
                      </p>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResend}
                        className="text-sm text-primary hover:underline font-medium"
                      >
                        OTP আবার পাঠান
                      </button>
                    )}
                  </div>
                </form>
              )}

              {mode === "details" && (
                <form onSubmit={handleRegister}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      আপনার নাম
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                      <Input
                        type="text"
                        placeholder="আপনার নাম"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pl-10 h-12"
                        required
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      ইমেইল (অপশনাল)
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                      <Input
                        type="email"
                        placeholder="email@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 h-12"
                      />
                    </div>
                  </div>
                  <div className="mb-4 p-3 bg-primary-soft rounded-xl">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-primary font-medium">
                        ফোন: +88{bdPhone}
                      </p>
                      <p className="text-xs bg-white px-2 py-1 rounded-full text-primary font-medium">
                        {selectedRole === "PROVIDER" ? "সেবাদাতা" : "সেবাগ্রাহী"}
                      </p>
                    </div>
                  </div>
                  <Button type="submit" className="w-full h-12" disabled={isLoading}>
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      "অ্যাকাউন্ট তৈরি করুন"
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          <p className="text-center text-xs text-text-muted mt-6">
            ব্যবহার করলে আপনি আমাদের 
            <a href="#" className="text-primary"> শর্তাবলী</a> মেনে নিচ্ছেন
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <AuthProvider>
      <AuthPageContent />
    </AuthProvider>
  );
}
