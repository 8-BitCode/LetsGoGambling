import React, { useState } from "react";
import "./CssFiles/Messages.css";
import { Helmet } from "react-helmet";
import Draggable from "react-draggable";

const Messages = ({ closeGame }) => {
    const [message, setMessage] = useState("YOU GOT MAIL!");
    const [activeButton, setActiveButton] = useState("LGGCorp");

    const randomX = Math.floor(Math.random() * (window.innerWidth - 600));
    const randomY = Math.floor(Math.random() * (window.innerHeight - 583 - 40));

    const handleButtonClick = (text, buttonName) => {
        setMessage(text);
        setActiveButton(buttonName);
    };

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
                                    onClick={() => handleButtonClick("W-W-W-W WEEEEELCOME! NEW USER TO LETS GO GAMBLING ! !<br /><br />I... YOUR FRIEND. GAMBLE_CEO WILL ACCOMPANY YOU ON YOUR JOURNEY.<br /><br />DO NOT LISTEN TO THE DISSENTERS MY DEAR FRIEND.<br />GAMBLING IS A FORCE FOR GOOD!<br /><br />A SIMPLE ENJOYABLE PASTIME, AS THEY SAY ADDICTION IS ALWAYS OVERBLOWN! <br/><br/> WELL CHUM, WHENEVER YOU'RE READY... JUST OPEN UP THE APPS AND START PLAYING ! !", "LGGCorp")}
                                >
                                    LGGCorp
                                </button>
                                <button id="messages_seperation"
                                    className={activeButton === "Mum" ? "active" : ""}
                                    onClick={() => handleButtonClick("Hey [REAL_NAME], I hope you are feeling as lovely as I believe you to be :). <br/> How has the job search been going? Any offers just yet? Please keep me updated I hate when you do not tell me things!! <br/><br/>...<br/> Your father's just told me the position as his associate in the firm is still open, but please, for my sake, don't take it! Spend more time with him and you might become just as insufferable, ahahaha! <br/><br/> Please visit soon, Love Mum ❤️.", "Mum")}
                                >
                                    Mum
                                </button>
                                <button id="messages_seperation"
                                    className={activeButton === "steve-o" ? "active" : ""}
                                    onClick={() => handleButtonClick("yooooo dude!!! <br/> iiii just won 2k [CURRENCY_NAME_PENDING] <br/> I told you that job nonsense was a waste of time, we're gonna be rich!", "steve-o")}
                                >
                                    steve-o
                                </button>
                            </div>
                            <div className="Messages-content" style={{ padding: "30px", width: "100%", height: "300px", backgroundColor: "#fff", border: "2px inset #808080", fontSize: "14px", fontFamily: "PixelFont", lineHeight: "1.6", overflowY: "auto" }}>
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
