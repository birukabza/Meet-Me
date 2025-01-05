import CustomButton from "../../components/custom-buttons/CustomButton";

import { useState, useContext } from "react";

import { Link} from "react-router-dom";

import AuthContext from "../../contexts/AuthContext";

const SignIn = () => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { authSignIn } = useContext(AuthContext)


    const handleSignIn = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try{

            await authSignIn(username, password);
        }catch(error){
            console.log("error while signing up", error)
        }finally{
            setIsSubmitting(false);
        }
    };
    

    return (
        <div className="flex items-center justify-center min-h-screen ml-24">
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
                    <CustomButton type="submit" width="w-32" disabled={isSubmitting}>{ isSubmitting? "Signing In..." : "Sign In"}</CustomButton>
                </form>
                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">
                        Don&apos;t have an account?{" "}
                        <Link to="/signup" className="text-secondary hover:underline">Sign up</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignIn;
