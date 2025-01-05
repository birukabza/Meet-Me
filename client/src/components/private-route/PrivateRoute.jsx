import AuthContext from "../../contexts/AuthContext";
import { useContext } from "react";
import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";
import Loading from "../Loading/Loading";

const PrivateRoute = ({ children }) => {
    const { isAuthenticated, isAuthLoading } = useContext(AuthContext);

    if (isAuthLoading) {
        return (
            <div className="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center  bg-opacity-50 z-50">
                <Loading />
            </div>
        )
    }

    return isAuthenticated ? children : <Navigate to="/signin" />;
};

PrivateRoute.propTypes = {
    children: PropTypes.node.isRequired,
};

export default PrivateRoute;
