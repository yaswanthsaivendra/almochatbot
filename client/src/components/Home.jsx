import { useState } from "react";


const Home = () => {

    const [message, setMessage] = useState("");
    const [history, setHistory] = useState([
        {
            role: "assistant",
            content:
                "Hello! Ask me about your product related queries.",
        },
    ]);

    const handleClick = () => {
        if (message == "") return;
        setHistory((oldHistory) => [
            ...oldHistory,
            { role: "user", content: message },
        ]);
        setMessage("");
        fetch("http://127.0.0.1:5000/api/chat/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query: message, history: history }),
        })
            .then(async (res) => {
                console.log(res)
                const r = await res.json();
                setHistory((oldHistory) => [...oldHistory, r]);
            })
            .catch((err) => {
                alert(err);
            });
    };

    return (
        <div className="flex flex-col bg-bgcolor h-screen text-white">
            <h1 className="text-center mt-16 font-bold text-4xl">
                AlmoChat Bot
            </h1>
            <div className="flex flex-col h-full">
                <div className="flex flex-col h-full max-h-[64vh] bg-gray-200 mx-12 lg:mx-52 my-12 overflow-y-scroll p-4 lg:p-10 rounded-md space-y-2">
                    {history.map((message, idx) => {
                        switch (message.role) {
                            case "assistant":
                                return (
                                    <div
                                        key={idx}
                                        className="flex gap-2"
                                    >
                                        <img
                                            src="images/assistant-avatar.jpg"
                                            className="h-12 w-12 rounded-full"
                                        />
                                        <div className="w-auto max-w-xl break-words bg-white rounded-b-xl rounded-tr-xl text-black p-6 shadow-[0_10px_40px_0px_rgba(0,0,0,0.15)]">
                                            <p className="text-sm font-medium text-primary mb-2">
                                                AI assistant
                                            </p>
                                            {message.content}
                                        </div>
                                    </div>
                                );
                            case "user":
                                return (
                                    <div
                                        className="w-auto max-w-xl break-words bg-white rounded-b-xl rounded-tl-xl text-black p-4 self-end shadow-[0_10px_40px_0px_rgba(0,0,0,0.15)]"
                                        key={idx}
                                    >
                                        <p className="text-sm font-medium text-violet-500 mb-2">
                                            You
                                        </p>
                                        {message.content}
                                    </div>
                                );
                        }
                    })}
                </div>
                <div className="mx-12 lg:mx-52 mb-12 p-4 bg-white rounded-xl h-20 text-black">
                    <form className="flex" onSubmit={(e) => {
                        e.preventDefault();
                        handleClick();
                    }}>
                        <input type="text" className="flex-1 mr-3 rounded-lg border border-black px-2"
                            placeholder="Your message..."
                            aria-label="chat input"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)} onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handleClick();
                                }
                            }} />

                        <button onClick={(e) => {
                            e.preventDefault();
                            handleClick();
                        }}
                            className="px-2 sm:px-5 py-2 rounded-md text-white bg-primary" id="chat-message-submit">Send</button>
                    </form>
                </div>

            </div>



        </div>
    )
}

export default Home