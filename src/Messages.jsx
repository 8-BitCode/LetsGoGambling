import React, { useState, useEffect } from "react";
import "./CssFiles/Messages.css";
import { Helmet } from "react-helmet";
import Draggable from "react-draggable";
import Click from './Assets/SoundEffects/Click.wav';

const Messages = ({ closeGame }) => {
    const [activeButton, setActiveButton] = useState("LGGCorp");
    const [Level, setLevel] = useState(4); // Initialize Level state
    const [message, setMessage] = useState(""); // Start with an empty message

    const randomX = Math.floor(Math.random() * (window.innerWidth - 600));
    const randomY = Math.floor(Math.random() * (window.innerHeight - 583 - 40));

    // Function to generate a separator that matches the width of the box
    const generateSeparator = () => {
        // Adjust the number of dashes based on the width of the box
        const separatorLength = 50; // Approximate number of characters that fit in one line
        return "-".repeat(separatorLength) + "<br/>";
    };
  const playClickSound = () => {
    const audio = new Audio(Click);
    audio.play().catch((error) => {
      console.error('Error playing sound:', error);
    });
  };
    const handleButtonClick = (buttonName) => {
        let newMessage = "";
        playClickSound()

        if (buttonName === "LGGCorp") {
            if (Level >= 1) {
                newMessage += "W-W-W-W WEEEEELCOME! NEW USER TO LETS GO GAMBLING ! !<br /><br />I... YOUR FRIEND. GAMBLE_CEO WILL ACCOMPANY YOU ON YOUR JOURNEY.<br /><br />DO NOT LISTEN TO THE DISSENTERS MY DEAR FRIEND.<br />GAMBLING IS A FORCE FOR GOOD!<br /><br />A SIMPLE ENJOYABLE PASTIME, AS THEY SAY ADDICTION IS ALWAYS OVERBLOWN! <br/><br/> WELL CHUM, WHENEVER YOU'RE READY... JUST OPEN UP THE APPS AND START PLAYING ! !";
            }
            if (Level >= 2) {
                newMessage = "Message 2 Corp<br/>" + generateSeparator() + newMessage;
            }
            if (Level >= 3) {
                newMessage = "Message 3 Corp<br/>" + generateSeparator() + newMessage;
            }
            if (Level >= 4) {
                newMessage = "Message 4 Corp<br/>" + generateSeparator() + newMessage;
            }
        } else if (buttonName === "Mum") {
            if (Level >= 1) {
                newMessage += "Hey [REAL_NAME], I hope you are feeling as lovely as I believe you to be :). <br/> How has the job search been going? Any offers just yet? Please keep me updated I hate when you do not tell me things!! <br/><br/>...<br/> Your father's just told me the position as his associate in the firm is still open, but please, for my sake, don't take it! Spend more time with him and you might become just as insufferable, ahahaha! <br/><br/> Please visit soon, Love Mum ❤️.";
            }
            if (Level >= 2) {
                newMessage = "Message 2 Mum<br/>" + generateSeparator() + newMessage;
            }
            if (Level >= 3) {
                newMessage = "Message 3 Mum<br/>" + generateSeparator() + newMessage;
            }
            if (Level >= 4) {
                newMessage = "Message 4 Mum<br/>" + generateSeparator() + newMessage;
            }
        } else if (buttonName === "steve-o") {
            if (Level >= 1) {
                newMessage += "yooooo dude!!! <br/> iiii just won 2k [CURRENCY_NAME_PENDING] <br/> I told you that job nonsense was a waste of time, we're gonna be rich!<br/>";
            }
            if (Level >= 2) {
                newMessage = "Message 2 Steve<br/>" + generateSeparator() + newMessage;
            }
            if (Level >= 3) {
                newMessage = "Message 3 Steve<br/>" + generateSeparator() + newMessage;
            }
            if (Level >= 4) {
                newMessage = "Message 4 Steve<br/>" + generateSeparator() + newMessage;
            }
        }

        setMessage(newMessage);
        setActiveButton(buttonName);
    };

    // Automatically trigger the message display when the component mounts
    useEffect(() => {
        handleButtonClick("LGGCorp"); // Default to showing LGGCorp messages
    }, []); // Empty dependency array ensures this runs only once on mount

    return (
        <>
            <Helmet>
                <title>Messages</title>
            </Helmet>
            <Draggable defaultPosition={{ x: randomX, y: randomY }}>
                <div className="Messages-container">
                    <div className="Messages-window">
                        <div className="top-bar">
                            <span className="top-bar-title">chat89.exe</span>
                            <div className="top-bar-buttons">
                                <button className="close-button" onClick={closeGame}>
                                    X
                                </button>
                            </div>
                        </div>
                        <div style={{ display: "flex" }}>
                            <div className="Messages-sidebar" style={{ width: "100px", backgroundColor: "#A9A9A9", padding: "1px" }}>
                                <button id="messages_seperation"
                                    className={activeButton === "LGGCorp" ? "active" : ""}
                                    onClick={() => handleButtonClick("LGGCorp")}
                                >
                                    LGGCorp
                                </button>
                                <button id="messages_seperation"
                                    className={activeButton === "Mum" ? "active" : ""}
                                    onClick={() => handleButtonClick("Mum")}
                                >
                                    Mum
                                </button>
                                <button id="messages_seperation"
                                    className={activeButton === "steve-o" ? "active" : ""}
                                    onClick={() => handleButtonClick("steve-o")}
                                >
                                    steve-o
                                </button>
                            </div>
                            <div className="Messages-content" style={{ padding: "30px", width: "100%", height: "300px", backgroundColor: "#fff", border: "2px inset #808080", fontSize: "14px", fontFamily: "PixelFont", lineHeight: "1.6", overflowY: "auto", wordWrap: "break-word" }}>
                                <div dangerouslySetInnerHTML={{ __html: message }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </Draggable>
        </>
    );
};

export default Messages;