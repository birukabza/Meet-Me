import CustomButton from "../../components/custom-button/CustomButton";

import { useState } from "react";

import { signInApi } from "../../api/userApi";

import {useNavigate} from "react-router-dom";

const SignIn = () => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleSignIn = async (e) => {
        e.preventDefault();
        try {
            const response = await signInApi(username, password);
            if (response.success) {
                navigate(`/profile/${username}`);
            } else {
                alert(response.message || "Invalid username or password");
            }
        } catch (error) {
            alert("An unexpected error occurred. Please try again later.");
            console.error("Sign-in error:", error);
        }
    };
    

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r ">
            <div className="bg-primaryLight1 p-8 rounded-2xl shadow-sm shadow-white w-full max-w-sm ">
                <h1 className="text-3xl font-semibold text-center text-secondary mb-6">Sign In</h1>
                <form className="space-y-4" onSubmit={handleSignIn}>
                    <div>
                        <label className="block text-sm font-medium text-white">User name
                        <input
                            type="text"
                            className="w-full p-3 mt-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary text-black"
                            placeholder="Enter your username"
                            onChange={(e)=>setUsername(e.target.value)}
                            name="username"
                            value={username}
                            required
                        />
                        </label>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-white">Password
                        <input
                            type="password"
                            className="w-full p-3 mt-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary  text-black"
                            placeholder="Enter your password"
                            onChange={(e)=>setPassword(e.target.value)}
                            name="password"
                            value={password}
                            required
                        />
                        </label>
                    </div>
                    <CustomButton type="submit" width="w-32">Sign In</CustomButton>
                </form>
                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">
                        Don&apos;t have an account?{" "}
                        <a href="#" className="text-blue-500 hover:underline">Sign up</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignIn;
