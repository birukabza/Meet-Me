
const Loading = () => {
    return (
        <div className="flex flex-row gap-2">
            <div className="size-8 rounded-full bg-secondary animate-bounce"></div>
            <div
                className="size-8 rounded-full bg-secondary animate-bounce [animation-delay:-.3s]"
            ></div>
            <div
                className="size-8 rounded-full bg-secondary animate-bounce [animation-delay:-.5s]"
            ></div>
        </div>
    )
}

export default Loading
