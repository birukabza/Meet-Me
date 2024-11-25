const SideBarIcons = ({ icon, logo, text }) => {
    return (
        <div className="side-bar-icons group">
            {logo ? <img src={icon} alt="Company Logo" /> : icon}
            {text ? (
                <span className="side-bar-side-text group-hover:scale-100">{text}</span>
            ) : null}
        </div>
    );
};

export default SideBarIcons;
