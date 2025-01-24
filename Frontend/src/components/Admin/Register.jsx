import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { API_URL } from "@/lib/authConfig";

export default function AdminRegister() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*]/.test(password);

    return {
      isValid:
        password.length >= minLength &&
        hasUpperCase &&
        hasLowerCase &&
        hasNumbers &&
        hasSpecialChar,
      errors: {
        length: password.length < minLength,
        upperCase: !hasUpperCase,
        lowerCase: !hasLowerCase,
        numbers: !hasNumbers,
        specialChar: !hasSpecialChar,
      },
    };
  };

  const handleRegister = async (e) => {
    e.preventDefault();
  
    const passwordValidation = validatePassword(formData.password);

    if (!passwordValidation.isValid) {
      let errorMessage = "Password must contain:";
      if (passwordValidation.errors.length)
        errorMessage += "\n- At least 8 characters";
      if (passwordValidation.errors.upperCase)
        errorMessage += "\n- One uppercase letter";
      if (passwordValidation.errors.lowerCase)
        errorMessage += "\n- One lowercase letter";
      if (passwordValidation.errors.numbers) errorMessage += "\n- One number";
      if (passwordValidation.errors.specialChar)
        errorMessage += "\n- One special character (!@#$%^&*)";

      toast({
        variant: "destructive",
        title: "Invalid Password",
        description: errorMessage,
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Passwords do not match"
      });
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/api/admin/register`, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      if (response.data.success) {
        toast({
          title: "Success",
          description: response.data.message,
        });
        navigate("/admin/login");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description:
          error.response?.data?.message ||
          "An error occurred during registration",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-8 space-y-6 border rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-center">Admin Registration</h1>
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <Input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Confirm Password</label>
            <Input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Register
          </Button>
        </form>
        <div className="text-center text-sm">
          <Link to="/admin/login" className="text-primary hover:underline">
            Already have an account? Login
          </Link>
        </div>
      </div>
    </div>
  );
}
