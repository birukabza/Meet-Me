import CustomButton from "../../components/custom-button/CustomButton";

import { useState } from "react";

import { signUpApi } from "../../api/userApi";

import {useNavigate} from "react-router-dom";
import { Link } from "react-router-dom";

const SignUp = () => {

    const [userData, setUserData] = useState({
        username: "",
        email: "",
        first_name: "",
        last_name: "",
        password: "",
        confirmPassword: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate();


    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setUserData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      };

    const handleSignUp = async (e) => {
        e.preventDefault();
        // eslint-disable-next-line no-unused-vars
        const {confirmPassword, ...dataToSend} = userData;

        if (userData.confirmPassword !== userData.password){
            alert("passwords do not match")
            return
        }
        setIsSubmitting(true)
        try {
            const response = await signUpApi(dataToSend);
            if (response.success) {
                navigate("/signin");
            } else {
                alert("something went wrong");
            }
        } catch (error) {
            alert("An unexpected error occurred. Please try again later.");
            console.error("Sign-up error:", error);
        } finally{
            setIsSubmitting(false)
        }
    };
    

    return (
        <div className="flex items-center justify-center min-h-screen ml-24 ">
            <div className="bg-primaryLight1 p-8 rounded-2xl shadow-sm shadow-white w-full max-w-sm ">
                <h1 className="text-3xl font-semibold text-center text-secondary mb-6">Sign up</h1>
                <form className="space-y-4" onSubmit={handleSignUp}>
                    <div>
                        <label className="block text-sm font-medium text-white">User name
                        <input
                            type="text"
                            className="w-full p-3 mt-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary text-black"
                            placeholder="Enter your username"
                            onChange={handleFormChange}
                            name="username"
                            value={userData.username}
                            required
                        />
                        </label>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-white">Email
                        <input
                            type="email"
                            className="w-full p-3 mt-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary text-black"
                            placeholder="Enter your email"
                            onChange={handleFormChange}
                            name="email"
                            value={userData.email}

                            required
                        />
                        </label>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-white">First name
                        <input
                            type="text"
                            className="w-full p-3 mt-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary text-black"
                            placeholder="Enter your first name"
                            onChange={handleFormChange}
                            name="first_name"
                            value={userData.first_name}

                            required
                        />
                        </label>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-white">last name
                        <input
                            type="text"
                            className="w-full p-3 mt-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary text-black"
                            placeholder="Enter your last name"
                            onChange={handleFormChange}
                            name="last_name"
                            value={userData.last_name}
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
                            name="password"
                            onChange={handleFormChange}
                            value={userData.password}
                            required
                        />
                        </label>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-white">Confirm Password
                        <input
                            type="password"
                            className="w-full p-3 mt-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary  text-black"
                            placeholder="Enter your password"
                            name="confirmPassword"
                            onChange={handleFormChange}
                            value={userData.confirmPassword}
                            required
                        />
                        </label>
                    </div>
                    <CustomButton type="submit" width="w-32" disabled={isSubmitting}>{isSubmitting ? "Signing up..." : "Sign up"}</CustomButton>
                </form>
                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">
                        already have an account?{" "}
                        <Link to="/signin" className="text-secondary hover:underline">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
