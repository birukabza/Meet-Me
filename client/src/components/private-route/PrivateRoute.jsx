import AuthContext from "../../contexts/AuthContext";
import { useContext } from "react";
import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
    const { isAuthenticated, isAuthLoading } = useContext(AuthContext);

    if (isAuthLoading) {
        return <p className="flex justify-center">Loading ...</p>;
    }

    return isAuthenticated ? children : <Navigate to="/signin" />;
};

PrivateRoute.propTypes = {
    children: PropTypes.node.isRequired,
};

export default PrivateRoute;
