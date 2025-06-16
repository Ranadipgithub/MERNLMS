import { initialSignInFormData, initialSignUpFormData } from "@/config";
import { checkAuthService, loginService, registerService } from "@/services";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
    const [signUpFormData, setSignUpFormData] = useState(initialSignUpFormData);
    const [signInFormData, setSignInFormData] = useState(initialSignInFormData);
    const [auth, setAuth] = useState({
        authenticate: false,
        user: null
    })
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    async function handleRegisterUser(event) {
        event.preventDefault();
        const data = await registerService(signUpFormData);
        if (data.success) {
            navigate("/auth/verify-email", { state: { userEmail: signUpFormData.userEmail } });
        }
    }

    async function handleLoginUser(event) {
        event.preventDefault();
        const data = await loginService(signInFormData);
        if (data.success) {
            sessionStorage.setItem('accessToken', JSON.stringify(data.data.accessToken))
            setAuth({
                authenticate: true,
                user: data.data.user
            })
        } else {
            if (data.message.includes("User is not verified")) {
                navigate("/auth/verify-email", { state: { userEmail: signInFormData.userEmail } });
            } else {
                setAuth({
                    authenticate: false,
                    user: null
                })
            }
        }
    }

    function resetCredentials() {
        setAuth({
            authenticate: false,
            user: null
        });
    }

    useEffect(() => {
        checkAuthUser();
    }, []);

    async function checkAuthUser() {
        try {
            const data = await checkAuthService();
            if (data.success) {
                setAuth({
                    authenticate: true,
                    user: data.data.user,
                });
                setLoading(false);
            } else {
                setAuth({
                    authenticate: false,
                    user: null,
                });
                setLoading(false);
            }
        } catch (error) {
            console.log(error);
            if (!error?.response?.data?.success) {
                setAuth({
                    authenticate: false,
                    user: null,
                });
                setLoading(false);
            }
        }
    }

    return (
        <AuthContext.Provider value={{ signUpFormData, setSignUpFormData, signInFormData, setSignInFormData, handleRegisterUser, handleLoginUser, auth, resetCredentials }}>
            {loading
                ? <div className="flex items-center justify-center h-screen">Loading...</div>
                : children
            }

        </AuthContext.Provider>
    );
}