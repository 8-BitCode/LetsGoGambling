import React, { useState, useEffect, useRef } from "react";
import "./CssFiles/Messages.css";
import { Helmet } from "react-helmet";
import Draggable from "react-draggable";
import Click from "./Assets/SoundEffects/Click.wav";
import MumPfpIcon from "./Assets/Icons/MumPfpIcon.png";
import LGGPfpIcon from "./Assets/Icons/LGGPfpIcon.png";
import SteveOPfpIcon from "./Assets/Icons/SteveOPfpIcon.png";
const Messages = ({
    closeGame,
    Level,
    onNewMail,
    username,
    money,
    hasNewMail,
    setLevel,
    updateLevelInFirestore,
}) => {
    const [activeButton, setActiveButton] = useState(null);
    const [message, setMessage] = useState(
        hasNewMail ? "You got mail!" : "No new mail :(",
    );
    const [newMailFor, setNewMailFor] = useState([]); // Tracks which people have new mail
    const randomX = Math.floor(Math.random() * (window.innerWidth - 600));
    const randomY = Math.floor(Math.random() * (window.innerHeight - 583 - 40));
    const messageLevels = {
        LGGCorp: [1, 2, 20, 30, 55, 79, 90, 150, 190, 210, 220, 240, 270, 400],
        Mum: [1, 45, 75, 110, 130, 132, 150, 250, 280, 310, 360],
        "steve-o": [
            1, 14, 21, 46, 65, 78, 100, 120, 140, 155, 175, 210, 249, 270, 280, 285,
            290, 330, 331,
        ],
    };
    // Function to generate a separator that matches the width of the box
    const generateSeparator = () => {
        const separatorLength = 51; // Approximate number of characters that fit in one line
        return "<br/><br/><br/>" + "-".repeat(separatorLength) + "<br/><br/><br/>";
    };

    const playClickSound = () => {
        const audio = new Audio(Click);
        audio.play().catch((error) => {
            console.error("Error playing sound:", error);
        });
    };
    useEffect(() => {
        if (hasNewMail) {
            const peopleWithNewMail = [];
            for (const [person, levels] of Object.entries(messageLevels)) {
                if (levels.includes(Level)) {
                    peopleWithNewMail.push(person); // Add person to the array
                }
            }
            setNewMailFor(peopleWithNewMail); // Set the array of people with new mail
        }
    }, [hasNewMail, Level]);
    const generateMessageForContact = (buttonName) => {
        let newMessage = "";

        return newMessage;
    };
    const handleButtonClick = (buttonName) => {
        if (buttonName === activeButton) return;
        playClickSound();

        // Scroll to top when switching messages
        if (messageContentRef.current) {
            messageContentRef.current.scrollTop = 0;
        }

        // Add level change conditions
        if (buttonName === "steve-o" && Level === 78) {
            const newLevel = 79;
            setLevel(newLevel);
            updateLevelInFirestore(newLevel);
        } else if (buttonName === "Mum" && Level === 45) {
            const newLevel = 46;
            setLevel(newLevel);
            updateLevelInFirestore(newLevel);
        } else if (buttonName === "LGGCorp" && Level === 20) {
            const newLevel = 21;
            setLevel(newLevel);
            updateLevelInFirestore(newLevel);
        }

        let newMessage = generateMessageForContact(buttonName);

        if (buttonName === "LGGCorp") {
            if (Level >= 1) {
                newMessage =
                    "W-W-W-W WEEEEELCOME! NEW USER TO LETS GO GAMBLING ! !<br /><br />I... YOUR FRIEND. GAMBLE_CEO WILL ACCOMPANY YOU ON YOUR JOURNEY.<br /><br />DO NOT LISTEN TO THE DISSENTERS MY DEAR FRIEND.<br />GAMBLING IS A FORCE FOR GOOD!<br /><br />A SIMPLE ENJOYABLE PASTIME, AS THEY SAY ADDICTION IS ALWAYS OVERBLOWN! <br/><br/> WELL CHUM, WHENEVER YOU'RE READY... JUST OPEN UP THE APPS AND START PLAYING ! !" +
                    generateSeparator() +
                    newMessage;
            }

            if (Level >= 2) {
                newMessage =
                    "WOAH WOAH WOAH CHUM!<br/><br/>DON’T TELL ME YOU’VE BEGUN TO TURN THE WHEELS OF FATE BEFORE YOU’VE EVEN MANAGED TO GET A LOOK AT THE INSTRUCTIONS! ! <br/><br/><br/>WHAT?! THEY HAVEN'T BEEN IMPLEMENTED?! DAMN THOSE LAZY DEVELOPERS! AND THEY HAVE THE GALL TO SUGGEST A UNION.<br/><br/> NOT TO WORRY! I SAID I'D HELP RIGHT? <br/><br/>" +
                    "<span style='color:lime;'>ROULETTE: CHOOSE YOUR CHIP SIZE AND BET ON COLOUR, PARITY, OR NUMBER. THE LOWER THE CHANCE OF MATCHING, THE HIGHER THE PAY OUT!</span><br/><br/>" +
                    "<span style='color:blue;'>BLACKJACK: TRY TO GET AS CLOSE TO 21 AS POSSIBLE, IF YOUR OPPONENT IS CLOSER THEN THEY TAKE HOME THE CASH! IF NOT, DOUBLE YOUR EARNING BABY!</span><br/><br/>" +
                    "<span style='color:red;'>SLOTS: PRESS THE SPIN BUTTON AND HOPE FOR THE BEST! JUST DON'T LET SLOTTO'S TAUNTS GET TO YA!</span><br/><br/>" +
                    "SIMPLE, NO? BUT YOU SEE, EVEN IN SIMPLICITY LIES ENDLESS POSSIBILITY! <br/><br/> I HOPE YOU MANAGE TO HAVE FUN WITH THEM." +
                    generateSeparator() +
                    newMessage;
            }
            if (Level >= 20) {
                newMessage =
                    "<span style='color:gray;'>OOOOOH KEEP GAMBLING<br/><br/>OOOOOOOOH SUBLIMINAL MESSAGING<br/><br/>OOOOOH YOU DID NOT READ THIS</span>" +
                    generateSeparator() +
                    newMessage;
            }

            if (Level >= 30) {
                newMessage =
                    "WELL WELL WELL<br/><br/>I SEE YOU HAVE BEGUN TO PROCURE QUITE A HEALTHY BIT OF CAPITAL!<br/>A WHOLE " +
                    money +
                    " <span style='color:lime;'>SHAMBUX</span>?!<br/><br/>HOW PROMISING, YOU KNOW THAT IS JUST HOW MUCH I HAD WHEN I FIRST STARTED <span style='color:DarkGoldenRod;'>RUNNING BUSINESS…</span><br/>NOT!! I WAS BORN RICH. <br/><br/>AHEM, STILL. YOUR PACE IS QUITE EXTRAORDINARY... KEEP AT IT." +
                    generateSeparator() +
                    newMessage;
            }

            if (Level >= 55) {
                newMessage =
                    "W-W-W-WO HAHA WOW USER!<br/><br/>YOU JUST KEEP GOING!<br/><br/>GAMBLING LIKE THIS.... . . . . .. . IT HAS NOT BEEN SEEN SINCE..?<br/>!<br/>NOT SINCE THE LEGENDARY <span style='color:red;'>WAGER WAR OF ’89</span> !!1!!!! !<br/><br/>YOU MIGHT JUST HAVE WHAT IT TAKES TO..." +
                    generateSeparator() +
                    newMessage;
            }

            if (Level >= 79) {
                newMessage =
                    "MAKE HIM STOP MESSAGING ME<br/>MAKE HIM STOP MESSAGING ME<br/>MAKE HIM STOP MESSAGING ME<br/>MAKE HIM STOP MESSAGING ME<br/>MAKE HIM STOP MESSAGING ME<br/>MAKE HIM STOP MESSAGING ME<br/>" +
                    generateSeparator() +
                    newMessage;
            }

            if (Level >= 90) {
                newMessage =
                    "YOUR DEDICATION  !<br/>YOUR AMBITION !<br/>YOUR PASSION FOR THE CRAFT!<br/><br/>USER, YOU REMIND ME OF A YOUNGER ME.<br/><br/>THAT IS WHY I AM SELECTING YOU, AND ONLY YOU <i>DEFINITELY NOT EVERY OTHER USER AS WELL</i> AS THE SOLE PROPRIETOR OF THIS MISSION!<br/><br/>YOU HAVE SEEN THE LOCKED APP INCLUDED WITH YOUR <b>Let’s Go Gambling! Starter Collection 1995</b> RIGHT?! YOU SEE... IT HAS NEVER BEEN OPENED BEFORE. IT REQUIRES AN UNBELIEVABLE LEVEL OF GAMBLING ABILITY; I BELIEVE YOU HOLD THAT POWER.<br/><br/>UNLOCK THE LOCK! ONLY THEN WILL YOU UNDERSTAND THE TRUE MEANING OF GAMBLING!" +
                    generateSeparator() +
                    newMessage;
            }

            if (Level >= 150) {
                newMessage =
                    "USER! WE HAVE AN EMERGENCY, AND AS MY APPOINTED PROPRIETOR YOU HAVE A VESTED INTEREST.<br/><br/>THE WORKERS HAVE UNIONISED!" +
                    generateSeparator() +
                    newMessage;
            }

            if (Level >= 190) {
                newMessage =
                    "A CEO MUST ALWAYS NEGOTIATE FROM A POSITION OF STRENGTH.<br/><br/> THAT IS WHY I OFFERED THE EMPLOYEES A VERY GENEROUS DEAL.<br/><br/> KEEP WORKING FOR MINIMUM WAGE, DISSOLVE THE UNION, AND STOP THREATENING TO LEAK OUR 100% LEGAL TIME-MANIPULATION TECHNOLOGY. OR JUST QUIT!<br/><br/><br/>ON AN ENTIRELY UNRELATED NOTE, HEY USER YOU WOULDN'T HAPPEN TO BE SEARCHING FOR EMPLOYMENT?" +
                    generateSeparator() +
                    newMessage;
            }

            if (Level >= 210) {
                newMessage =
                    "STOCK PRICES ARE TUMBLING, INVESTORS ARE LOSING CONFIDENCE.<br/><br/>ZAIN HAS GIVEN ME 1 WEEK TO SORT OUT THE COMPANY, OR THEY'RE FIRING ME AS CEO!<br/><br/>JEEZ SO YOU LOSE ONE ENTIRE WORKFORCE. AND YOU SPEND JUST ONE HALF OF THE COMPANY BUDGET PAYING PEOPLE TO STAY QUIET. AND THEN ONE OTHER HALF HIRING INEXPERIENCED GAMBLING ADDICTS TO PICK UP THE SLACK... CAUSING US TO ALSO LOSE OUR MAIN REVENUE SOURCE SIMULTANEOUSLY.<br/><br/>NOT THE BEST WEEK FOR LGGCORP..." +
                    generateSeparator() +
                    newMessage;
            }

            if (Level >= 220) {
                newMessage =
                    "WHY GOD!! WHY MUST YOU PUNISH ME THIS WAY!!!<br/><br/> IS THIS BECAUSE OF ALL THE LYING?! LOOK I PROMISE, I'LL TELL TH- <br/><br/> HOLD ON YOU'RE NOT GOD! !" +
                    generateSeparator() +
                    newMessage;
            }

            if (Level >= 240) {
                newMessage =
                    "YOU KNOW, YOU'VE NEVER REALLY HAD IT HARD IN LIFE, UNLESS YOU'VE FELT WHAT IT'S LIKE TO BE RICH.<br/><br/>IT'S A CONSTANT UPHILL BATTLE, EVERYONE'S ALWAYS FIGHTING EACH OTHER TO SEE WHO CAN MAKE<br/>MORE!<br/>MORE!!<br/>MONEY!!!<br/><br/>IT'S A COMPLETE CESSPOOL OF GREED AND NARCISSISM!<br/><br/>AREN'T SOME THINGS MORE IMPORTANT? WHAT HAPPENED TO LOVE, WHAT HAPPENED TO KINDNESS, HONOR TO YOUR FELLOW COMRADES?<br/><br/><br/>OH SORRY MEANT TO SEND THAT TO ZAIN. HE'S STILL JUST A MILLIONAIRE, POOR GUY. " +
                    generateSeparator() +
                    newMessage;
            }

            if (Level >= 270) {
                newMessage =
                    "USER!!!! <br/><br/> NO, " +
                    username +
                    "... <br/><br/> I HAVE ALWAYS BEEN THERE WHEN YOU NEEDED ME<br/><br/> LET'S LOOK BACK ON THE MEMORIES <br/><br/><br/><br/> AHHH GOOD TIMES. <br/><br/> BUT NOW, YOU NEED TO RETURN THE FAVOUR! <br/><br/> NO ONE KNOWS HOW TO GAMBLE LIKE YOU DO <br/><br/> NO ONE WHO ISN'T ON MY PAYROLL NOW AT LEAST! AHAHAHA! <br/><br/><br/> SERIOUSLY USER, I'M SCREWED. THE ONLY WAY YOU CAN HELP ME OUT... IS BY CONTINUING TO PLACE THOSE BIG BIG BETS! GENERATING REVENUE FOR MY COMPANY! AND FINALLY, BY UNLOCKING THAT LOCK, WE MAY JUST BE ABLE TO SAVE THIS COMPANY, TOGETHER." +
                    generateSeparator() +
                    newMessage;
            }

            if (Level >= 400) {
                newMessage =
                    "Dear Users,<br/><br/>I would like to extend a sincere and humble apology for the conduct of our former Chief Executive Officer, known solely as “gamble_ceo.” His behaviour was unprofessional, erratic, and most regrettably, deeply damaging to the image and integrity of our company.<br/><br/>We recognise the harm caused by his leadership. The constant firing-and-rehiring, the questionable monetisation mechanics, the obsessive messaging of users.<br/>None of it aligns with the vision LGGCorp seeks to uphold. That era is over.<br/>Under my leadership, we are entering a new chapter: one defined by clarity, structure, and mutual respect.<br/><br/>Your continued engagement is essential to us. And we are excited for you to join us as we push forward the <b>Let's Go Gambling</b> experience beyond anything it has ever been before.<br/><br/><br/>Thank you for your loyalty and understanding.<br/><br/>No bad bets this time. This time, we’re playing to win.<br/><br/><br/>Warm regards, Zain Qureshi<br/>Chief Executive Officer of LGGCorp™" +
                    generateSeparator() +
                    newMessage;
            }
        } else if (buttonName === "Mum") {
            if (Level >= 1) {
                newMessage =
                    "Hey sweetheart, I hope you are having a wonderful day today :). <br/>How has the job search been going? Any offers just yet? Please keep me updated I hate when you do not tell me things!! <br/><br/>...<br/>Your father has just told me the position as an associate in his company is still open, but please, for my sake, don't take it! Spend more time with him and you might become just as insufferable, ahahaha! <br/><br/>Please visit soon, Love Mum <3." +
                    generateSeparator() +
                    newMessage;
            }
            if (Level >= 45) {
                newMessage =
                    "<span style='color:darkred;'><b> I noticed you have not answered my phone calls >:( </b></span> <br/><br/>Were this under normal circumstances, I would be very angry with you. However, I have received an anonymous <img src='" + SteveOPfpIcon + "' style='width:20px;height:20px;vertical-align:middle;'> tip that suddenly changes everything!<br/><br/>Oh my sweet little child, you should have told me!! You are becoming just like your father was when he was your age!<br/><br/>When he and I first got together, I was a bit apprehensive about his more… volatile line of income. But it was hard to argue when he would come home each night with two times more than the last ahaha!<br/><br/>I'm so proud of you <3  Good luck ;)" +
                    generateSeparator() +
                    newMessage;
            }
            if (Level >= 75) {
                newMessage =
                    "Hello my sweet little crab cake! Do you remember my old friend Layla? She bought a drawing from you once when you were a kid, and then you and Steven spent months hounding her with your homemade arts and crafts, trying to get her to buy more. Ahaha, she ended up spending so much at our house that she had to stop coming over!<br/><br/> Anyway, her son, Zain, fancies himself a bit of an internet investor. Keeps going on about some kind of 'dot-com balloon' and how it is never going to burst. Very confident. <br/><br/> Naturally, he was quite intrigued when I mentioned your <span style='color:blue;'><b>internet business!</b></span> <br/><br/> So, I have invited them both over for tea and biscuits tonight. If you and your business partner happen to be free, this could be a golden opportunity to continue your long-standing tradition of selling things to this poor family." +
                    generateSeparator() +
                    newMessage;
            }
            if (Level >= 110) {
                newMessage =
                    "Someone has placed a bomb on these freshly baked chelsea buns --oooh and they are baked to perfection--<br/><br/> If only someone were here to defuse them! Oh well!" +
                    generateSeparator() +
                    newMessage;
            }
            if (Level >= 130) {
                newMessage =
                    "Oh sweetie!! You must come quick!<br/><br/>Your father is about to start his solo reenactment of 'The Card'!<br/><br/> He has been practicing all week. There are props. There are costume changes. Worst of all, I think he expects 'audience participation'. He handed me a script and said, ‘You’ll know when to come in.’ I will not. <br/><br/>Please come save me! If you let me suffer through this alone, I will never forgive you!!" +
                    generateSeparator() +
                    newMessage;
            }
            if (Level >= 132) {
                newMessage =
                    "I miss you so much, where are you." +
                    generateSeparator() +
                    newMessage;
            }
            if (Level >= 150) {
                newMessage =
                    "You have some explaining to do.<br/><br/>I just got off the phone with Steven. I had been trying to prod him for details on your little 'business endeavour' because heaven knows you will never tell me anything. He kept coming up with excuses for why he could not say.<br/><br/>Ahaha... It started to remind me of when you two were kids. He'd stand by the kitchen door blocking me from entering, while you grabbed all the chelsea buns, making all sorts of excuses for why I could not go inside.<br/><br/>Ha, that boy is still absolutely rubbish at lying.<br/><br/><br/>I threated to revoke his 'hug license' if he didn't tell me the truth, and well, he cracked like an egg. But when I asked for details on what you two have really been doing for the past few weeks... He just hung up." +
                    generateSeparator() +
                    newMessage;
            }
            if (Level >= 250) {
                newMessage =
                    "I have been standing outside your front door knocking for the past hour. <br/><br/>I could hear your ringtone playing from the inside as I phoned you. And what sounded like the audio of a computer game? <br/><br/>I still do not know what you have gotten yourself into, but please do not leave me in the dark like this. If it’s something you feel like you need to do, then I will try to support you. But please, this secrecy is killing me. <br/><br/>By the way, apologies for the scratches on the door. You see your father came along... You understand." +
                    generateSeparator() +
                    newMessage;
            }
            if (Level >= 280) {
                newMessage =
                    "I cannot sleep.<br/><br/>Every time I close my eyes, all I can see is you. And then I get excited thinking you’ve come home, but you’re never here." +
                    generateSeparator() +
                    newMessage;
            }
            if (Level >= 310) {
                newMessage =
                    "I have contacted the bank. They said the files were 'confidential' but I threatened to revoke their 'hug licenses', and they cracked like eggs. <br/><br/>The bank tells me your finances over the last few weeks have been extremely erratic. Rapid rise and falls, transfers and withdrawals, loans and paybacks even within the same day. They’ve had to call you dozens of times just to be sure you have not been defrauded. But funnily enough, you always manage to answer.<br/><br/>So then, do you just enjoy torturing your poor mother?<br/><br/>Regardless, this all paints me a clear enough picture. You are safe. Ensuring that has always been my priority.<br/><br/>Whatever financial nonsense you have gotten yourself involved in, I do not want to hear of any part of it. But the moment you come to your senses and realise that there are more important things.<br/>You can always come home. We won’t need to talk about it. And your chelsea buns will still be in the freezer, ready to be dethawed.<br/>Until then, goodbye. Please take care of yourself." +
                    generateSeparator() +
                    newMessage;
            }
            if (Level >= 360) {
                newMessage =
                    "Hello.<br/><br/>I just wanted to update you on what has been going on recently.<br/><br/>Steven has been staying at our home the last several days. I caught the poor boy crying alone in the library, clicking on a digital slot machine every few seconds. It turns out, he’d been evicted, and had been sleeping outside in the cold for days!<br/><br/>I brought him back home, wrapped him up in a nice warm blanket, and made him some tea. Within minutes, he started telling me everything, from the beginning. What the both of you have been up to.<br/><br/>How can you be so stupid?! You’ve thrown your entire life away over GAMBLING? NO WONDER YOU DID NOT WANT TO TELL ME, THAT IS PATHETIC!!!<br/>HAVE YOU NOT HEARD THAT THE HOUSE ALWAYS WINS! You are being completely manipulated!<br/><br/>...<br/>I cannot believe however, that despite that revelation. You are still not the member of this family I am most angry at. I noticed as Steven progressed through his story, your father grew more and more nervous. Before he broke down too, and started telling his own story... and well. I will just let him explain.<br/><br/><br/><br/>WHY HELLO THERE CHUM ! !!<br/><br/>I SHOULD HAVE KNOWN A USER OF YOUR EXPERTISE COULD ONLY BE MY VERY OWN NEXT OF KIN!<br/><br/>SO YES, IT IS TRUE. I HAVE BEEN HIDING AN ENTIRE GAMBLING EMPIRE IN SECRET, BUT IN MY DEFENSE.<br/><br/><br/>ANYWAY.<br/>IT'S NOT LIKE IT MATTERS ANYMORE, ZAIN FIRED ME. AND SINCE I GOT PAID MOSTLY IN STOCK THAT IS NOW WORTHLESS. I... WELL.<br/><br/>INSTEAD OF PRETENDING TO BE MIDDLE CLASS, NOW I ACTUALLY AM!<br/>THESE CORRUPT BILLIONAIRES, THROWING POOR HARD-WORKING CEOS OUT ONTO THE STREET... HOW COULD SOMEONE DO SOMETHING LIKE THAT?! HOLD ON...<br/><br/>EFFECTIVELY I'M BACK TO SQUARE ONE. I WANTED TO HIT THE GROUND RUNNING AND GET RIGHT BACK TO STARTING NEW BUSINESS. BUT YOUR MOTHER PRESENTED ME WITH A CRUEL LIST OF DEMANDS. AS A POWERFUL FORMER CEO, I HAD TO NEGOTIATE FROM A POSITION OF STRENGTH. BUT SHE THREATENED TO REVOKE MY 'HUG LICENSE' AND WELL... I CRACKED LIKE AN EGG.<br/><br/>FIRST OFF, NO MORE DISHONESTY. SECOND, I MUST 100% FOLLOW HER PERSONAL ETHICAL GUIDELINES!!(TYRANNY)!!. AND LASTLY... I MUST INCLUDE<br/><br/><br/>H-HEY! WHAT ARE YO-<br/><br/><br/>yoooo dudeski!!! i'm totally pumped!! i feel like i could pop a million wheelies!!!!<br/><br/>me and your dad, are like total best friends now<br/><br/><br/>WE ARE NOT ! ! ! ! !<br/><br/><br/>he says he's gonna make me an 'associate' in his new company. i can't wait, he's already got me started on special <i>associate business</i> ! !!<br/><br/><br/>EXCUSE ME. DON'T YOU HAVE A JOB TO BE DOING<br/><br/><br/>oh right!! see you later dudezilla!<br/><br/><br/>I'M MAKING HIM START BY SCRUBBING THE TOILETS. HE NEEDS TO LEARN PROPER WORK ETHIC BEFORE HE EVEN CONSIDERS BEING AT THE TOP.<br/><br/><br/>but weren't you born rich?<br/><br/><br/>THAT'S A LIE I TELL PEOPLE SO THEY DON'T LOOK INTO MY PAST!! AND AREN'T YOU SUPPOSED TO BE WORKING ! !<br/><br/><br/>yes, sir!!<br/><br/><br/>AHEM, RIGHT. I GUESS I SHOULD APOLOGISE FOR WHAT MY PROGRAMS DID TO YOU AND YOUR ANNOYING FRIEND. LOOKING OVER YOUR MOTHERS ETHICS LIST... MY COMPANY REALLY BROKE A LOOOOT OF THESE. THE LAW REALLY NEEDS TO CATCH UP.<br/><br/>SO... I'M SORRY. I'M SORRY I DID THIS TO YOU. I'M SORRY YOU FEEL LIKE YOU CAN'T STOP. SORRY YOU EVER GOT SUCKED IN IN THE FIRST PLACE.<br/><br/>I HAVE NO CONTROL OVER THE COMPANY ANYMORE, SO I CAN'T HELP YOU ANY MORE THAN THAT. BUT I CAN SAY, IF YOU'RE STILL TRYING TO MAKE ENOUGH MONEY TO OPEN THE LOCK... LET ME TELL YOU, IT ISN'T WORTH TRYING.<br/><br/>IT'S JUST A TRICK, ALL OF IT. IT'S DESIGNED TO ALWAYS BE OUT OF REACH. I DON'T EVEN KNOW WHAT'S BEHIND IT, I'M NOT SURE ANYTHING EVEN IS.<br/><br/><br/>JUST... GET OFF THE GAMES AND MOVE ON. IT'S THE ONLY TRUE WAY TO WIN.<br/><br/><br/><br/>WELL, THAT'S ALL I REALLY HAVE TO SAY. I'M GONNA GET BACK TO STARTING NEW BUSINESS. I'M THINKING OF OPENING A THEATRE ? !<br/><br/><br/><br/><br/>You know it is kind of hard to believe he genuinely was a good businessman once. Ahaha I suppose it is no surprise actually, that he starts to go off the rails the minute he no longer has me by his side!<br/><br/><br/>...I know that breaking the cycle of a<b>d</b>diction isn't <b>e</b>asy. I can't pretend to have any kind of clue on what you're going through. But p<b>l</b><b>e</b>ase if no<b>t</b> for yours<b>e</b>lf just yet, <b>the</b>n for me, for us. Don't think about it. Just stop. <b>G</b>et up from the screen. T<b>a</b>ke a deep breath, and go outside. Every step away from this darkness is one step closer to reclai<b>m</b>ing who you truly ar<b>e</b>. Addiction thrives in <b>s</b>ilence, shame, and isolation. But you don't have to fight it alone, you never have.<br/><br/>The three of us are having a nice big family dinner tonight, chelsea buns will be on the table! And I've made sure to invite Zain over to bully your father, ahahaha!<br/><br/>I've left a sixth chair empty for you. I hope I see you here with us tonight.<br/><br/>Love, Mum <3" +
                    generateSeparator() +
                    newMessage;
            }
        } else if (buttonName === "steve-o") {
            if (Level >= 1) {
                newMessage =
                    "yooooo dude!!! <br/> iiii just won 20 whole shambux!! <br/>I told you that job nonsense was a waste of time, we're gonna be rich!<br/>" +
                    generateSeparator() +
                    newMessage;
            }
            if (Level >= 14) {
                newMessage =
                    "dude-ski.<br/>I gotta give a cyber round of applause to the developers of these three games.<br/><br/>blackjack. roulette. slots.<br/>they’re so enjoyable, i don’t even feel the time passing me by!<br/>you know it feels like it’s only been a few minutes since we started, but it’s actually been over an hour<br/><br/>guess that’s just what happens when you’re having fun! " +
                    generateSeparator() +
                    newMessage;
            }

            if (Level >= 21) {
                newMessage =
                    "anyone else just get the sudden urge to gamble" +
                    generateSeparator() +
                    newMessage;
            }

            if (Level >= 46) {
                newMessage =
                    "so your mum thinks we've decided to make a store together... on the internet<br/><br/>don't blame me dude she called and i panicked!!" +
                    generateSeparator() +
                    newMessage;
            }
            if (Level >= 65) {
                newMessage =
                    "hola mi dudemig-o!<br/><br/>CHECK OUT THESE GRAPHS I'VE JUST MADE!!<br/><br/><i><span style='color:darkgray;'>[Graph depicting an exponential curve. The latter half is earmarked 'Future Earnings']</span></i><br/><br/>LOOK AT THIS!! THE SHAMBUX JUST KEEP GOING UP AND UP! AND TO THINK, WE COULD'VE ENDED UP SCRUBBING TOILETS LIKE A COUPLE OF <span style='color:red;'><b>LOSERS!!</b></span><br/><br/>USING THOSE FINANCIAL SKILLS I FORCED YOUR DAD TO TEACH ME, I’VE ESTIMATED THAT I SHOULD BE A TRILLIONAIRE IN JUST 3 SHORT WEEKS!!!!" +
                    generateSeparator() +
                    newMessage;
            }

            if (Level >= 78) {
                newMessage =
                    "damn... just made a bad bet<br/>lost like... half my capital. gamble_ceo is gonna be inconsolable " +
                    generateSeparator() +
                    newMessage;
            }

            if (Level >= 100) {
                newMessage =
                    "hey hey hey my dudocious dude<br/>sooooooo how are yo-<br/>haha who am i kidding i can already tell just by looking at your STATISTICS page<br/><br/>you’ve been the same too haven’t you? the numbers going up and down, and down and up all night long. <br/><br/>ha ha... the feeling it gives you, it’s unlike anything you’ve ever felt before isn’t it?<br/><br/>It feels wrong, but I just can’t stop.<br/><br/>No, I don’t want to stop." +
                    generateSeparator() +
                    newMessage;
            }

            if (Level >= 120) {
                newMessage =
                    "something bad happened<br/><br/>turns out while we’ve been um, gambling. hailey’s been knocking on my door every day for the past week.<br/>i didn’t realise it had even been that long until I found her trying to break into my flat this morning. (jeez get a cell phone lady?! it’s 1995!)<br/><br/>i managed to switch my computer tab to the graphs though and convinced her i was just getting really into finance<br/><br/>but still, i’m on thin ice dude, i gotta lay low for a while." +
                    generateSeparator() +
                    newMessage;
            }

            if (Level >= 140) {
                newMessage =
                    "things have been kinda tense between me and hailey the past couple days<br/><br/>i think she knows i was lying, it’s really worrying me<br/><br/>think i’m gonna try to buy something to butter her up... and then tell her the truth. if she sees how much money i’m making, maybe she won’t be mad." +
                    generateSeparator() +
                    newMessage;
            }

            if (Level >= 155) {
                newMessage =
                    "i’ve been at the skate park all day today, trying to think of what to get hailey, but all that’s on my mind is how angry i am at slotto for beating me last spin<br/><br/>can’t even pop any wheelies dude<br/>slotto’s ruined me<br/><br/>think i’m just gonna go home now, i won’t feel better until i get that money back and wipe that smug look off his face" +
                    generateSeparator() +
                    newMessage;
            }

            if (Level >= 175) {
                newMessage =
                    "so i was just going home from the skatepark, a little deflated, but on the way back...<br/><br/><b>a store?!</b> <i>but not just any store!</i> right on the display case, the most beautiful engagement ring i’ve ever seen.<br/><br/> dude-tree, it's been 3 months. i think it's finally time." +
                    generateSeparator() +
                    newMessage;
            }

            if (Level >= 210) {
                newMessage =
                    "ooooooooooooooooooooooooooooooooooooooo<br/>gamble gamble gamble that is all i need<br/>who needs love it’s a waste of time<br/>I’ll be on this game all year!<br/><br/>i’ve destroyed my skateboard, it reminds me too much of she who cannot be named... she used to love my wheelies<br/><br/>AGH WHY DOES IT MATTER WHERE I GOT THE MONEY FROM!!!! IT’S HERE NOW ISN’T IT?!<br/>AND I’M PLENTY RESPONSIBLE AREN’T I?!<br/><br/><br/>AREN'T I?" +
                    generateSeparator() +
                    newMessage;
            }

            if (Level >= 249) {
                newMessage =
                    "uh oh<br/><br/>don’t check my stats page" +
                    generateSeparator() +
                    newMessage;
            }

            if (Level >= 270) {
                newMessage =
                    "it’s okay. i’ll earn it back. <br/>still a week to go until my rent’s due" +
                    generateSeparator() +
                    newMessage;
            }

            if (Level >= 280) {
                newMessage =
                    "why isn’t it going up<br/><br/>i thought<br/><br/>the graph" +
                    generateSeparator() +
                    newMessage;
            }

            if (Level >= 285) {
                newMessage =
                    "dude you gotta help me, the rent is due today and i’ve got no one else to turn to<br/><br/>please i don’t know what to do" +
                    generateSeparator() +
                    newMessage;
            }

            if (Level >= 290) {
                newMessage =
                    "i’ve been late the last 3 months he’s going to evict me<br/><br/>i’m going to be homeless" +
                    generateSeparator() +
                    newMessage;
            }

            if (Level >= 330) {
                newMessage =
                    "its okay. its like your mum always said, never too late to turn things around right? im gonna win it all back, everything, everyone. i just need one good hand" +
                    generateSeparator() +
                    newMessage;
            }

            if (Level >= 331) {
                newMessage =
                    "actually, i don’t even know why i’m still messaging you. you’ve been ignoring me the past month.<br/><br/>well, I guess it’s just...<br/>every time i've checked, you’ve always been online on LGG: switching between slots, blackjack, roulette, taking strategic loans, paying off interest. you’re the most dedicated gambler I’ve ever seen (though whether that’s a good thing is up to you).<br/>it’s why... I find it curious that the only time i’ve ever seen you go offline, is the moment right after I send you a message." +
                    generateSeparator() +
                    newMessage;
            }
        }
        // Update the message display
        setMessage(newMessage);
        setActiveButton(buttonName);

        // Mark the contact's messages as read
        setNewMailFor((prev) => {
            const updatedNewMailFor = prev.filter((person) => person !== buttonName);

            // Notify parent only if all messages are read
            if (updatedNewMailFor.length === 0) {
                onNewMail(false); // Notify parent that all messages are read
            }

            return updatedNewMailFor;
        });
    };

    const messageContentRef = useRef(null); // Add this ref

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
                            <div
                                className="Messages-sidebar"
                                style={{
                                    width: "100px",
                                    backgroundColor: "#A9A9A9",
                                    padding: "1px",
                                }}
                            >
                                <button
                                    id="messages_seperation"
                                    className={`${activeButton === "LGGCorp" ? "active" : ""} ${newMailFor.includes("LGGCorp") ? "new-mail" : ""}`}
                                    onClick={() => handleButtonClick("LGGCorp")}
                                >
                                    LGGCorp
                                    <img className="Pfps" src={LGGPfpIcon}></img>
                                </button>
                                <button
                                    id="messages_seperation"
                                    className={`${activeButton === "Mum" ? "active" : ""} ${newMailFor.includes("Mum") ? "new-mail" : ""}`}
                                    onClick={() => handleButtonClick("Mum")}
                                >
                                    Mum
                                    <img className="Pfps" src={MumPfpIcon}></img>
                                </button>
                                <button
                                    id="messages_seperation"
                                    className={`${activeButton === "steve-o" ? "active" : ""} ${newMailFor.includes("steve-o") ? "new-mail" : ""}`}
                                    onClick={() => handleButtonClick("steve-o")}
                                >
                                    steve-o
                                    <img className="Pfps" src={SteveOPfpIcon}></img>
                                </button>
                            </div>
                            <div
                                ref={messageContentRef}
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
