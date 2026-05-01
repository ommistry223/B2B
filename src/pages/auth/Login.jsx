import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { Checkbox } from "../../components/ui/Checkbox";
import Icon from "../../components/AppIcon";
import { useUser } from "../../context/UserContext";

const Login = () => {
  const { login } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        window.location.replace("/dashboard");
      } else {
        setErrors({
          email: result.error || "Login failed. Please check your credentials.",
        });
      }
    } catch (error) {
      setErrors({ email: "An error occurred. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
    const redirectUrl = `${window.location.origin}/auth/google/callback`;
    const authUrl = `${apiBase}/auth/google?redirect=${encodeURIComponent(redirectUrl)}`;
    window.location.href = authUrl;
  };

  const handleMicrosoftLogin = () => {};

  const features = [
    { icon: "Shield", text: "AI-powered credit risk scoring" },
    { icon: "TrendingUp", text: "Real-time cash flow analytics" },
    { icon: "Bell", text: "Automated payment reminders" },
    { icon: "FileText", text: "GST-compliant invoicing" },
  ];

  return (
    <>
      <Helmet>
        <title>Login - CreditFlow Pro</title>
      </Helmet>
      <div className="min-h-screen flex">
        {/* Left Brand Panel — desktop only */}
        <div className="hidden lg:flex lg:w-[45%] xl:w-[40%] flex-col justify-between bg-primary p-12">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center">
              <Icon name="TrendingUp" size={20} color="#FFFFFF" />
            </div>
            <span
              className="text-white font-bold text-lg tracking-tight"
              style={{ fontFamily: "Space Grotesk, sans-serif" }}
            >
              CreditFlow Pro
            </span>
          </div>

          <div className="space-y-8">
            <div>
              <h2
                className="text-3xl font-bold text-white leading-tight mb-3"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                Smart B2B Credit Management
              </h2>
              <p className="text-white/70 text-base leading-relaxed">
                Reduce credit risk, accelerate collections, and maintain healthy
                cash flow — all from one platform.
              </p>
            </div>
            <div className="space-y-4">
              {features.map((f, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-white/15 flex items-center justify-center flex-shrink-0">
                    <Icon name={f.icon} size={16} color="#FFFFFF" />
                  </div>
                  <span className="text-white/85 text-sm">{f.text}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-white/40 text-xs">
            © 2024 CreditFlow Pro. All rights reserved.
          </p>
        </div>

        {/* Right Form Panel */}
        <div className="flex-1 flex items-center justify-center bg-background p-6 sm:p-10">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="flex items-center gap-2.5 mb-8 lg:hidden">
              <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
                <Icon name="TrendingUp" size={20} color="#FFFFFF" />
              </div>
              <span
                className="font-bold text-lg text-foreground tracking-tight"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                CreditFlow Pro
              </span>
            </div>

            <div className="mb-8">
              <h1 className="text-2xl font-bold text-foreground mb-1.5">
                Welcome back
              </h1>
              <p className="text-muted-foreground text-sm">
                Sign in to your account to continue
              </p>
            </div>

            <div className="bg-card rounded-xl p-6 border border-border shadow-elevation-sm">
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  type="email"
                  label="Email Address"
                  placeholder="you@company.com"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  error={errors.email}
                  required
                  autoComplete="email"
                />
                <Input
                  type="password"
                  label="Password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  error={errors.password}
                  required
                  autoComplete="current-password"
                />
                <div className="flex items-center justify-between pt-1">
                  <Checkbox
                    id="rememberMe"
                    label="Remember me"
                    checked={formData.rememberMe}
                    onChange={(e) =>
                      handleChange("rememberMe", e.target.checked)
                    }
                  />
                  <Link
                    to="/forgot-password"
                    className="text-sm font-medium text-primary hover:text-primary/80 transition-smooth"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Button
                  type="submit"
                  variant="default"
                  fullWidth
                  size="lg"
                  loading={isLoading}
                  disabled={isLoading}
                  className="mt-2"
                >
                  Sign In
                </Button>
              </form>

              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-card text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                >
                  <svg
                    className="w-4 h-4 mr-2 flex-shrink-0"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Google
                </Button>
                <Button
                  variant="outline"
                  onClick={handleMicrosoftLogin}
                  disabled={isLoading}
                >
                  <svg
                    className="w-4 h-4 mr-2 flex-shrink-0"
                    viewBox="0 0 23 23"
                  >
                    <path fill="#f3f3f3" d="M0 0h23v23H0z" />
                    <path fill="#f35325" d="M1 1h10v10H1z" />
                    <path fill="#81bc06" d="M12 1h10v10H12z" />
                    <path fill="#05a6f0" d="M1 12h10v10H1z" />
                    <path fill="#ffba08" d="M12 12h10v10H12z" />
                  </svg>
                  Microsoft
                </Button>
              </div>
            </div>

            <p className="text-center mt-6 text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-medium text-primary hover:text-primary/80 transition-smooth"
              >
                Sign up for free
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
