class SignalingConnection {
    connection = null;
    messageListeners = [];

    constructor({
                    socketURL,
                    onOpen,
                    onMessage
                }) {
        this.socketURL = socketURL;
        this.onOpen = onOpen;
        this.messageListeners = [onMessage]
        this.connectToSocket();
    }

    sendToServer = msg => {
        const msgJSON = JSON.stringify(msg);
        this.connection.send(msgJSON);
    };

    connectToSocket = () => {
        let scheme = document.location.protocol === "https:" ? "wss" : "ws";
        let serverUrl = `${scheme}://${this.socketURL}`;

        this.connection = new WebSocket(serverUrl, "json");
        this.connection.onopen = () => this.onOpen();

        this.connection.onmessage = event => {
            console.log('ws: data received : ' + event.data);
            let msg = JSON.parse(event.data);
            this.messageListeners.forEach(func => func(msg))
        };

        this.connection.onerror = (err) => {
            console.error('ws: error : ',err)
        }
    };

    addMsgListener = func => {
        this.messageListeners = [...this.messageListeners, func];
        return () => {
            this.messageListeners = this.messageListeners.filter(f => f !== func)
        }
    }
}


export default SignalingConnection;