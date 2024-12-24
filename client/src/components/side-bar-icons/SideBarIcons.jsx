import PropTypes from "prop-types";
const SideBarIcons = ({ icon, text }) => {
    
    return (
        <div className="flex gap-4 justify-center items-center w-full hover:bg-gray-700 transition-all ease-in-out duration-300 rounded-lg p-2">

            <div className="text-secondary">{ icon }</div>
            <span className="text-white text-lg">{text}</span>

        </div>
    );
};
SideBarIcons.propTypes = {
    icon: PropTypes.element.isRequired,
    text: PropTypes.string,
}
export default SideBarIcons;
