const connectButton = document.getElementById("connect");
let socket;
console.log("main.js loaded")
//button on click callback function
function onClick(event) {
    console.log("click")
    socket = new WebSocket("ws://localhost:8080/hello", "v10.stomp");
    console.log(socket);

    socket.onopen = function(e) {
        console.log("[open] Connection established");
        console.log("Sending to server");
        socket.send("{'name': 'Jeff'}");
    };

    socket.onmessage = function(event) {
        console.log(`[message] Data received from server: ${event.data}`);
    };

    socket.onclose = function(event) {
        if (event.wasClean) {
            console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
        } else {
            // e.g. server process killed or network down
            // event.code is usually 1006 in this case
            console.log('[close] Connection died');
        }
    };

    socket.onerror = function(error) {
        console.log(error);
        console.log(`[error]`);
        disconnect();
    };
}
function disconnect() {
    if (socket != null) {
        socket.close();
    }
    console.log("Websocket is in disconnected state");
}


connectButton.addEventListener("click", onClick);
