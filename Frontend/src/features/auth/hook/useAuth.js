import { useContext } from "react";
import { AuthContext } from "../auth.context";
import { register, login, logout } from "../services/auth.api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { decodeToken } from "../utils/token.util";

function useAuth() {
  const context = useContext(AuthContext);
  const { setUser, setLoading, user } = context;
  const navigate = useNavigate();

  const getTokenFromCookie = () => {
    const cookies = document.cookie.split(";");
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split("=");
      if (name === "accessToken") {
        return decodeURIComponent(value);
      }
    }
    return null;
  };

  async function RegisterUser(formValues) {
    try {
      setLoading(true);

      const payload = {
        name: formValues.name,
        email: formValues.email.toLowerCase(),
        password: formValues.password,
        role: formValues.role,
        ...(formValues.role === "VENDOR"
          ? {
              company_name: formValues.company_name,
              gst_number: formValues.gst_number,
              contact_person: formValues.contact_person,
              phone: formValues.phone,
              address: formValues.address,
            }
          : {}),
      };

      const response = await register(payload);
      console.log("✅ Registration Response:", response);
      setUser(response.user);

      // Decode token and log role
      const token = getTokenFromCookie();
      if (token) {
        const decoded = decodeToken(token);
        if (decoded?.role) {
          console.log("✅ Registered - Role:", decoded.role);
        }
      }

      navigate("/");
      toast.success("Account created successfully!");
    } catch (error) {
      if (Array.isArray(error?.errors)) {
        error.errors.forEach((item) => {
          if (item?.msg) {
            toast.error(item.msg);
          }
        });
      } else {
        toast.error(error?.message || "Registration failed");
      }
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }

  async function LoginUser(formValues) {
    try {
      setLoading(true);
      const response = await login({
        email: formValues.email.toLowerCase(),
        password: formValues.password,
      });
      setUser(response.user);

      // Decode token and log role
      const token = getTokenFromCookie();
      if (token) {
        const decoded = decodeToken(token);
        if (decoded?.role) {
          console.log("✅ Logged In - Role:", decoded.role);
        }
      }

      navigate("/");
      toast.success("Welcome back!");
    } catch (error) {
      if (Array.isArray(error?.errors)) {
        error.errors.forEach((item) => {
          if (item?.msg) {
            toast.error(item.msg);
          }
        });
      } else {
        toast.error(error?.message || "Login failed");
      }
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }

  async function LogoutUser() {
    try {
      await logout();
      setUser(null);
      navigate("/login");
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error(error?.message || "Logout failed");
    }
  }

  return { RegisterUser, LoginUser, LogoutUser, user };
}

export default useAuth;
