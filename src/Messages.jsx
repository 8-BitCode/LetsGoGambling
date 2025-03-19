import React, { useState, useEffect } from "react";
import "./CssFiles/Messages.css";
import { Helmet } from "react-helmet";
import Draggable from "react-draggable";
import Click from './Assets/SoundEffects/Click.wav';

const Messages = ({ closeGame, Level, onNewMail }) => {
    const [activeButton, setActiveButton] = useState("LGGCorp");
    const [message, setMessage] = useState("");

    const randomX = Math.floor(Math.random() * (window.innerWidth - 600));
    const randomY = Math.floor(Math.random() * (window.innerHeight - 583 - 40));

    // Function to generate a separator that matches the width of the box
    const generateSeparator = () => {
        const separatorLength = 51; // Approximate number of characters that fit in one line
        return "<br/><br/><br/>" + "-".repeat(separatorLength) + "<br/><br/><br/>";   
    };

    const playClickSound = () => {
        const audio = new Audio(Click);
        audio.play().catch((error) => {
            console.error('Error playing sound:', error);
        });
    };

    useEffect(() => {
        const newMailTimer = setTimeout(() => {
            onNewMail(); // Notify parent component about new mail
        }, 3000); // Simulate new mail after 3 seconds

        return () => clearTimeout(newMailTimer);
    }, [onNewMail]);

    const handleButtonClick = (buttonName) => {
        let newMessage = "";
        playClickSound();

        // TEXT1
        if (buttonName === "LGGCorp") {
            if (Level >= 0) {
                newMessage = "W-W-W-W WEEEEELCOME! NEW USER TO LETS GO GAMBLING ! !<br /><br />I... YOUR FRIEND. GAMBLE_CEO WILL ACCOMPANY YOU ON YOUR JOURNEY.<br /><br />DO NOT LISTEN TO THE DISSENTERS MY DEAR FRIEND.<br />GAMBLING IS A FORCE FOR GOOD!<br /><br />A SIMPLE ENJOYABLE PASTIME, AS THEY SAY ADDICTION IS ALWAYS OVERBLOWN! <br/><br/> WELL CHUM, WHENEVER YOU'RE READY... JUST OPEN UP THE APPS AND START PLAYING ! !" + generateSeparator() + newMessage;
            }

            if (Level >= 2) {
                newMessage = "WOAH WOAH WOAH CHUM!<br/><br/>DON’T TELL ME YOU’VE BEGUN TO TURN THE WHEELS OF FATE BEFORE YOU’VE EVEN MANAGED TO GET A LOOK AT THE INSTRUCTIONS! ! <br/><br/><br/>WHAT?! THEY HAVEN'T BEEN IMPLEMENTED?! DAMN THOSE LAZY DEVELOPERS! AND THEY HAVE THE GALL TO SUGGEST A UNION.<br/><br/>WELL, YOU STILL NEED TO FIGURE OUT HOW THE GAMES WORK SO LOOK, I'LL THROW YOU A BONE. BUT YOU OWE ME ONE.<br/><br/>ROULETTE: CHOOSE YOUR CHIP SIZE AND BET ON COLOUR, PARITY, OR NUMBER. THE LOWER THE CHANCE OF MATCHING, THE HIGHER THE PAY OUT!<br/>BLACKJACK: TRY TO GET AS CLOSE TO 21 AS POSSIBLE, IF YOUR OPPONENT IS CLOSER THEN THEY TAKE HOME THE CASH! IF NOT, DOUBLE YOUR EARNING BABY! <br/>SLOTS: PRESS THE SPIN BUTTON AND YOU HAVE A CHANCE OF WINNING THINGS<br/><br/>SIMPLE RIGHT?! BUT YOU SEE, EVEN IN SIMPLICITY LIES ENDLESS POSSIBILITY! <br/> I HOPE YOU MANAGE TO HAVE FUN WITH THEM." + generateSeparator() + newMessage;
            }
            if (Level >= 15) {
                newMessage = "WELL WELL WELL<br/><br/>HOW IS MY FAVOURITE [USER_NAME] DOING?<br/><br/>I SEE YOU HAVE PROCURED QUITE A HEALTHY BIT OF CAPITAL!<br/>A WHOLE [PLAYER_CASH] ?!<br/><br/>HOW PROMISING, YOU KNOW THAT IS JUST HOW MUCH I HAD WHEN I FIRST STARTED RUNNING BUSINESS…<br/>NOT!! I WAS BORN RICH<br/><br/>REGARDLESS… EVERYONE BEGINS FROM ONE UNCERTAIN POINT OR OTHER. SO DO NOT LET YOUR CURRENT PATHETICNESS BOG YOU DOWN, IT IS JUST WHERE YOU ARE CURRENTLY MEANT TO BE!<br/><br/>CIRCUMSTANCES LIKE THIS CAN ALWAYS BE CHANGED. I THINK YOU ARE JUST A FEW BETS AWAY FROM A BIG BREAK! KEEP AT IT FRIEND, FORTURE IS ON ITS WAY!" + generateSeparator() + newMessage;
            }
            if (Level >= 22) {
                newMessage = "SAY GOOD BUDDY…<br/><br/>YOU’RE A LOYAL FELLOW AREN’T YOU… <br/><br/>YOU TRUST ME… DON’T YOU?" + generateSeparator() + newMessage;
            }
            if (Level >= 28) {
                newMessage = "THEN JOIN OUR EXCLUSIVE LGG LOYALTY REWARDS PROGRAM!<br/><br/>GAMBLE FOR 1000 DAYS STRAIGHT, AND WE’LL PERSONALLY INTRODUCE YOU TO A THERAPIST!<br/><br/>…<br/>WE’LL MAIL YOU THE DETAILS." + generateSeparator() + newMessage;
            }
            if (Level >= 49) {
                newMessage = "OOOOOH KEEP GAMBLING<br/><br/>OOOOOOOOH SUBLIMINAL MESSAGING<br/><br/>OOOOOH YOU DID NOT READ THIS MESSAGE" + generateSeparator() + newMessage;
            }
            if (Level >= 55) {
                newMessage = "W-W-W-WO HAHA WOW!<br/><br/>I SIMPLY MUST CONGRATULATE YOU ! !<br/><br/>GAMBLING LIKE THAT.... . . . . .. . IT HAS NOT BEEN SEEN SINCE..?<br/>!<br/>NOT SINCE THE LEGENDARY WAGER WAR OF ’89 !!1!!!! !<br/><br/>YOU MIGHT JUST BE ABLE TO REACH...<br/>(should… should I tell them? No, no you cannot! The user isn’t ready yet. They’ve only just started their gambling jour- QUIET INNER VOICES!! I’M TRYING TO THINK!!!) <br/><br/>EH, NO POINT IN KEEPING IT SECRET, YOU HAVE SEEN THE LOCKED APP INCLUDED WITH YOUR “Let’s Go Gambling! Starter Collection 95” RIGHT?!<br/>YOU SEE... IT HAS NEVER BEEN OPENED BEFORE, BUT I HAVE A FEELING ABOUT YOU I’VE NEVER FELT ABOUT ANY OTHER [USER_NAME] !<br/><br/>PROCURE THE CAPITAL DEAR CONFIDANTE, UNLOCK THE LOCK, AND REPORT BACK TO ME!" + generateSeparator() + newMessage;
            }
        } else if (buttonName === "Mum") {
            if (Level >= 0) {
                newMessage = "Hey [REAL_NAME], I hope you are feeling as lovely as I believe you to be :). <br/>How has the job search been going? Any offers just yet? Please keep me updated I hate when you don’t tell me things!! <br/><br/>...<br/>Your father's just told me the position as an associate in his company is still open, but please, for my sake, don't take it! Spend more time with him and you might become just as insufferable, ahahaha! <br/><br/>Please visit soon, Love Mum <3." + generateSeparator() + newMessage;
            }
            if (Level >= 10) {
                newMessage = "I noticed you have not answered my phone calls >:( <br/>Were this under normal circumstances, I would be very angry with you. However, ahaha I have received an anonymous tip that suddenly changes everything!<br/>Oh my sweet little child, you should have told me!! You’re becoming just like your father was when he was your age!<br/><br/>I remember early on when he and I first got together, I was a bit apprehensive about his more… volatile line of income. But it was hard to worry when he would come home each night with two times more than the last!<br/><br/>Now he’s happy to give you both advice, but of course, in our time we didn’t have any of this fancy internet piddle and pob. So, I wouldn’t be surprised if you two already know more than him! Good luck you two!" + generateSeparator() + newMessage;
            }
            if (Level >= 31) {
                newMessage = "Oh sweetie!! You must come quick!<br/><br/>Your father is about to start his solo reenactment of “Les Misérables”, he’s even decided to write a custom extended edition of your favourite part!<br/>Oh – and i’ve baked you some delicious chelsea buns. Also... your favourite." + generateSeparator() + newMessage;
            }
            if (Level >= 32) {
                newMessage = "I miss you so much, please visit soon." + generateSeparator() + newMessage;
            }
            if (Level >= 36) {
                newMessage = "I just got off the phone with Steven. I asked him for the name of your internet website so I could show some support from a distance!<br/><br/>He stammered, started to get quiet, I asked him if he was alright and he said he just needed to take a second to remember. After which I began to hear the distinct sound of keyboard pitter patter.<br/><br/>After a few empty seconds, he simply responded with “Littlewoods”.<br/><br/>Littlewoods retailer?! You two expect me to believe you’ve been chosen by John Moores himself to continue his business from beyond the grave?!<br/><br/>Oh dear, I must leave the scolding for later. I need to go restrain your father, he’s frothing like a mad dog because I mentioned John Moores again." + generateSeparator() + newMessage;
            }
            if (Level >= 46) {
                newMessage = "I have been standing outside your front door knocking for the past hour. <br/><br/>I could hear your ringtone playing from the inside as I phoned you. And what sounded like the audio of a computer game. <br/><br/>I still do not know what you two have gotten yourselves into, but please do not leave me in the dark like this. If it’s something you feel like you need to do, then I will try to support you. But please, this secrtiveness is killing me. <br/><br/>By the way, I should apologise for the scratches on the door. I brought your father along with me." + generateSeparator() + newMessage;
            }
            if (Level >= 63) {
                newMessage = "I cannot sleep.<br/><br/>Every time I close my eyes, all I can see is you. And then I get excited thinking you’ve come home, but you’re never here." + generateSeparator() + newMessage;
            }
            if (Level >= 64) {
                newMessage = "Also because your father has been having those theatrical dreams again. He keeps breaking into song while we’re in bed. And then for some reason John Moores keeps showing up at the end and it gets very violent, very fast.<br/>It is entertaining, but I am exhausted." + generateSeparator() + newMessage;
            }
            if (Level >= 80) {
                newMessage = "I’ve contacted everyone I can. The university, who tell me you haven’t been attending class. Your landlord, who tells me you have at least managed to pay rent on time. And most interestingly... your bank.<br/><br/>The bank tells me that your finances over the last few weeks have been extremely erratic. Rapid rise and falls, transfers and withdrawals, loans and paybacks even within the same day. They’ve had to call you dozens of times just to be sure you have not been defrauded. But funnily enough, you always manage to answer.<br/><br/>So then, do you just enjoy torturing your poor mother?<br/><br/>Regardless, this all paints me a clear enough picture. You are safe. Ensuring that has always been my priority.<br/><br/>Whatever financial nonsense you have gotten yourself involved in, I do not want to hear of any part of it. But the moment you come to your senses and realise that there are more important things.<br/>You can always come home. We won’t need to talk about it. And your chelsea buns will still be in the freezer, ready to be dethawed.<br/>Until then, goodbye. Please take care of yourself." + generateSeparator() + newMessage;
            }
            if (Level >= 103) {
                newMessage = "Hello [REAL_NAME]. I just wanted to update you on what has been going on recently. <br/><br/>Steven has been staying at our home the last several days. He has had quite a difficult month.<br/>I caught the poor boy in the library, crying with two suitcases behind him, clicking on a digital slot machine every few seconds. It turns out, he’d been evicted, and had been sleeping outside in the cold for days! <br/><br/>I brought him back home, wrapped him up in a nice warm blanket, and gave him some tea and chelsea buns. Within minutes, he started telling me everything, from the beginning. What the both of you have been up to.<br/><br/>How can you be so stupid?! You’ve thrown your entire life away over GAMBLING? NO WONDER YOU DID NOT WANT TO TELL ME, THAT IS PATHETIC!!!<br/><br/>Haven’t you always heard! THE HOUSE. ALWAYS. WINS!! You are being manipulated, and it seems to me like you just do not care. <br/>Surely you know the dangers of gambling by now?! It can cause low self-esteem, stress, anxiety and depression. Not only that, but it can cause the brain to release large amounts of dopamine, which is effectively a signal to your brain saying “ignore the consequences, this is pleasurable I am going to do it again!”. The exact same kind of reasoning that gets people addicted to DRUGS!! OR DO NOT TELL ME YOU HAVE STARTED DOING THOSE THINGS TOO!<br/>How much longer do you think it is going to be until you have “had enough”. 10 thousand [CURRENCY_NAME]s, 100 thousand [CURRENCY_NAME]s, what about a million billion [CURRENCY_NAME]s?<br/>The answer is never isn’t it. Because human greed is insatiable. And when it comes to games of change, failure is mathematically inevitable.<br/>You do not just need take my word for it, look at your poor friend Steven. Do you also want to end up in the cold, spinning a slot machine until your eyes turn red? Letting random numbers control your quality of life? Or do you want to be known for the multitudes of skills I know you possess. I know you have always doubted it, but you are so much more than what you hold yourself back to be.<br/><br/>...<br/>Honestly, I was hoping it was money laundering or something at least cool. This is just stupid. I can’t believe my child is stupid.<br/><br/>Anyway, Steven has been getting better. He keeps talking about being responsible, and has helping out with the cleaning. He wants to find proper stable employment and stop relying on short term gains, like gambling and being paid to pop wheelies in the skate park." + generateSeparator() + newMessage;
            }
        } else if (buttonName === "steve-o") {
            if (Level >= 0) {
                newMessage = "yooooo dude!!! <br/> iiii just won 20 whole [CURRENCY_NAME_PENDING] <br/>I told you that job nonsense was a waste of time, we're gonna be rich!<br/>" + generateSeparator() + newMessage;
            }
            if (Level >= 6) {
                newMessage = "dude-ski.<br/>I gotta give a cyber round of applause to the developers of these three games.<br/><br/>blackjack. roulette. slots.<br/>they’re so enjoyable, i don’t even feel the time passing me by!<br/>you know it feels like it’s only been a few minutes since we started, but it’s actually been over 6 hours<br/><br/>guess that’s just what happens when you’re having fun! " + generateSeparator() + newMessage;
            }
            if (Level >= 11) {
                newMessage = "so i may have just told your mum we’re becoming t-shirt salesmen" + generateSeparator() + newMessage;
            }
            if (Level >= 19) {
                newMessage = "hola mi querido amig-o!<br/><br/>welcome to THE DUDE REPORT!!!<br/>IF YOU’LL PLEEEEASE LOOK AT THESE GRAPHS:<br/>[DESCRIPTIVE TEXT: A DRAWING OF A HASTILY DRAWN LINE QUICKLY TICKING UP, A VERTICAL LINE SEPERATES CURRENT EARNINGS FROM EXPECTED FUTURE EARNINGS]<br/><br/>LOOK AT THIS!! THE EARNINGS JUST KEEP GOING UP AND UP, I’VE NEVER HAD THIS MUCH MONEY IN MY LIFE! AND TO THINK, WE ALMOST SETTLED ON BECOMING CLEANERS LIKE A COUPLE OF LOSERS!!<br/><br/>AWESOMENESS DOESN’T END THERE, USING THOSE FINANCIAL SKILLS YOUR DAD TAUGHT ME, I’VE ESTIMATED THAT I SHOULD BE A TRILLIONAIRE IN JUST 3 SHORT WEEKS!!!!<br/><br/>oh wow... it’s just sinking in<br/>if this all works out... i might finally be able to afford a sandwich from the pret near university of manchester<br/><br/>ah who am I kidding, no one can afford that" + generateSeparator() + newMessage;
            }
            if (Level >= 26) {
                newMessage = "hey hey hey my dudocious dude<br/>sooooooo how are yo-<br/>haha who am i kidding i can already tell just by looking at your STATISTICS page<br/><br/>you’ve been the same too haven’t you? the numbers going up and down, and down and up all night long. <br/><br/>ha ha... the feeling it gives you, it’s unlike anything you’ve ever felt before isn’t it?<br/><br/>It feels wrong, but I just can’t stop.<br/><br/>No, I don’t want to stop." + generateSeparator() + newMessage;
            }
            if (Level >= 41) {
                newMessage = "something bad happened<br/><br/>turns out while we’ve been um, gambling. hailey’s been knocking on my door every day for the past week.<br/>i didn’t realise it had even been that long until I found her trying to break into my flat this morning. (jeez get a cell phone lady?! it’s 1995!)<br/><br/>don’t worry though big dog, i used my trump card. managed to switch my computer tab to littlewoods and she totally bought it<br/><br/>still, i’m on thin ice dude, i gotta lay low for a while." + generateSeparator() + newMessage;
            }
            if (Level >= 52) {
                newMessage = "things have been kinda tense between me and hailey the past couple days<br/><br/>i think she’s starting to realise i was lying, it’s really worrying me<br/><br/>think i’m gonna try to buy something to butter her up... and then tell her the truth. if she sees how much money i’m making, she won’t be mad." + generateSeparator() + newMessage;
            }
            if (Level >= 60) {
                newMessage = "i’ve been at the skate park all day today, trying to think of what to get hailey, but all that’s on my mind is how pissed i am at slotto for beating me last spin<br/><br/>can’t even pop any wheelies dude<br/>slotto’s ruined me<br/><br/>think i’m just gonna go home now, i won’t feel better until i get that money back and wipe that smug look off his face" + generateSeparator() + newMessage;
            }
            if (Level >= 69) {
                newMessage = "so i was just going home from the skatepark, a little deflated<br/>but on the way back, i passed by a littlewoods? <br/><br/>and right on the display case, the most beautiful engagement ring i’ve ever seen...<br/><br/>I felt it when I walked in dude, the ghost of our supposed business partner john moores is guiding me to be his successor. the path forward is now completely clear. <br/>i’m gonna be the world’s richest gambler, with my best friend (you), and my soon-to-be fiance(!!!!!) by my side<br/><br/>Tomorrow is gonna be the best day ever" + generateSeparator() + newMessage;
            }
            if (Level >= 72) {
                newMessage = "This day couldn’t have gone any worse" + generateSeparator() + newMessage;
            }
            if (Level >= 76) {
                newMessage = "ooooooooooooooooooooooooooooooooooooooo<br/>gamble gamble gamble that is all i need<br/>who needs love it’s a waste of time<br/>I’ll be on this game all year!<br/><br/>i’ve destroyed my skateboard, it reminds me too much of she who cannot be named... she used to love my wheelies<br/><br/>AGH WHY DOES IT MATTER WHERE I GOT THE MONEY FROM!!!! IT’S HERE NOW ISN’T IT?!<br/>AND I’M PLENTY RESPONSIBLE AREN’T I?! WHY ELSE WOULD JOHN MOORES CHOOSE ME!!!!<br/>AHGHUSUGHBOIGIYOSGLOJPSR" + generateSeparator() + newMessage;
            }
            if (Level >= 83) {
                newMessage = "uh oh<br/><br/>don’t check my stats page" + generateSeparator() + newMessage;
            }
            if (Level >= 85) {
                newMessage = "it’s okay. i’ll earn it back. <br/>still a week to go until my rent’s due" + generateSeparator() + newMessage;
            }
            if (Level >= 86) {
                newMessage = "why isn’t it going up<br/><br/>i thought<br/><br/>the chart" + generateSeparator() + newMessage;
            }
            if (Level >= 88) {
                newMessage = "dude you gotta help me, the rent is due today and i’ve got no one else to turn to<br/><br/>please i don’t know what to do" + generateSeparator() + newMessage;
            }
            if (Level >= 89) {
                newMessage = "i’ve been late the last 3 months he’s going to evict me<br/><br/>i’m going to be homeless" + generateSeparator() + newMessage;
            }
            if (Level >= 95) {
                newMessage = "im gonna win it all back, everything, everyone. i just need one good hand." + generateSeparator() + newMessage;
            }
            if (Level >= 96) {
                newMessage = "actually, i don’t even know why i’m still messaging you. you’ve been ignoring me the past month.<br/><br/>well, I guess it’s just...<br/>every time I’ve check, you’ve always been online on LGG: switching between slots, blackjack, roulette, taking strategic loans, paying off interest. you’re the most dedicated gambler I’ve ever seen (though whether that’s a good thing is up to you).<br/>it’s why... I find it curious that the only time I’ve ever seen you go offline, is the moment right after I send you a message." + generateSeparator() + newMessage;
            }
        }

        setMessage(newMessage);
        setActiveButton(buttonName);
    };

    // Automatically trigger the message display when the component mounts
    useEffect(() => {
        handleButtonClick("LGGCorp"); // Default to showing LGGCorp messages
    }, []);

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
                                <button
                                    id="messages_seperation"
                                    className={activeButton === "LGGCorp" ? "active" : ""}
                                    onClick={() => handleButtonClick("LGGCorp")}
                                >
                                    LGGCorp
                                </button>
                                <button
                                    id="messages_seperation"
                                    className={activeButton === "Mum" ? "active" : ""}
                                    onClick={() => handleButtonClick("Mum")}
                                >
                                    Mum
                                </button>
                                <button
                                    id="messages_seperation"
                                    className={activeButton === "steve-o" ? "active" : ""}
                                    onClick={() => handleButtonClick("steve-o")}
                                >
                                    steve-o
                                </button>
                            </div>
                            <div
                                className="Messages-content"
                                style={{
                                    padding: "30px",
                                    width: "100%",
                                    height: "300px",
                                    backgroundColor: "#fff",
                                    border: "2px inset #808080",
                                    fontSize: "14px",
                                    fontFamily: "PixelFont",
                                    lineHeight: "1.6",
                                    overflowY: "auto",
                                    wordWrap: "break-word",
                                }}
                            >
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
