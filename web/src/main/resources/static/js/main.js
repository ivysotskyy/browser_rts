import * as StompJs from "../../../../../node_modules/@stomp/stompjs/esm6/index.js"
let client
const connectButton = document.getElementById("connect")
let connected = false;
function onConnect() {
    client.publish({
        destination: '/app/hello',
        body: JSON.stringify({username: "Statham"}),
        skipContentLengthHeader: true,
    });
}

connectButton.addEventListener("click", onConnect);

function connect() {

    client = new StompJs.Client({
        brokerURL: 'ws://localhost:8080/ws',

        connectHeaders: {
            login: 'user',
            passcode: 'password',
            host: "localhost",
            "accept-version": "v10.stomp, v11.stomp, v12.stomp"
        },

        debug: function (str) {
            console.log(str);
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
    });

    client.onConnect = function (frame) {
        console.log("Connected: ")
        console.log(frame.body)
        client.subscribe("/topic/greetings", messageCallback);
        // Do something, all subscribes must be done is this callback
        // This is needed because this will be executed after a (re)connect
    };

    client.onStompError = function (frame) {
        // Will be invoked in case of error encountered at Broker
        // Bad login/passcode typically will cause an error
        // Complaint brokers will set `message` header with a brief message. Body may contain details.
        // Compliant brokers will terminate the connection after any error
        console.log('Broker reported error: ' + frame.headers['message']);
        console.log('Additional details: ' + frame.body);
    };

    function messageCallback(message) {
        console.log("Message:\n ", message.body)
    }

    client.activate();
}

connect()