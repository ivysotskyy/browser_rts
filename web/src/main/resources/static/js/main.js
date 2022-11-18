const connectButton = document.getElementById("connect");
let socket;
console.log("main.js loaded")
//button on click callback function
function onClick(event) {
    console.log("click")
    socket = new WebSocket("ws://localhost:8080/hello");


    socket.onopen = function(e) {
        console.log("[open] Connection established");
        console.log("Sending to server");
        socket.send("John");
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
        console.log(`[error]`);
    };
}



connectButton.addEventListener("click", onClick);
