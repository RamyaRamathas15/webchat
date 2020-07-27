import React, { Component } from "react";
import Amplify, { Interactions } from "aws-amplify";
import { ChatBot, AmplifyTheme } from "aws-amplify-react";
import Navbar from "../Navbar/Navbar.js";

Amplify.configure({
    Auth: {
        identityPoolId: "us-east-1:7feaf584-a43a-42ce-a62b-4f949ea7d516",
        region: "us-east-1",
    },
    Interactions: {
        bots: {
            lmsHelperBot: {
                name: " lmsHelperBot",
                alias: "prod",
                region: "us-east-1",
            },
        },
    },
});

const myTheme = {
    ...AmplifyTheme,
    sectionHeader: {
        ...AmplifyTheme.sectionHeader,
        backgroundColor: "purple",
    },

};

class OnlineSupport extends Component {
    render() {
        return (
            <div className="App" style={{ backgroundColor: "whitesmoke" }} >
                <Navbar />
                <div className="m-5" style={{ marginBottom: "2rem" }}>
                    <ChatBot
                        title="Online Support"
                        theme={myTheme}
                        botName="lmsHelperBot"
                        welcomeMessage="Hey there, need any help?"
                        clearOnComplete={true}
                        conversationModeOn={false}

                    />
                </div>
            </div>
        );
    }
}

export default OnlineSupport;
