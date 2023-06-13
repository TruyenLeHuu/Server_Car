$.when(
  $.getScript('./configClient/config.js',function(){
      Socket_hostIP = hostIP;
      Socket_port = port;
  })).done(function(){
    const sendButton = document.getElementById('sendButton');
    const logContainer = document.getElementById('logContainer');
    
    socket = io.connect('http://' + Socket_hostIP + ':' + Socket_port, { transports : ['websocket'] });

    socket.on('Log-msg', function(data) {
        logData(data);
    });

    function logData(data) {
        const logItem = document.createElement('div');
        logItem.className = 'log-item';
        
        const timestamp = document.createElement('span');
        timestamp.className = 'log-timestamp';
        timestamp.innerText = new Date().toLocaleTimeString() + ": ";
        
        const logData = document.createElement('span');
        logData.className = 'log-data';
        logData.innerText =  JSON.stringify(data);
        
        logItem.appendChild(timestamp);
        logItem.appendChild(logData);
        logContainer.appendChild(logItem);
        
        logContainer.scrollTop = logContainer.scrollHeight;
    }

    const pointer = document.createElement('div');
    pointer.className = 'log-pointter';
    const pointerSpan = document.createElement('span');
    pointerSpan.innerText = "__";
    pointer.appendChild(pointerSpan);

    const pointerSpace = document.createElement('div');
    const pointerSpaceSpan = document.createElement('span');
    pointerSpaceSpan.innerText = "--";
    pointerSpace.className = 'log-pointter';
    pointerSpace.appendChild(pointerSpaceSpan);

    setInterval(() => { 
        logContainer.appendChild(pointer);
        logContainer.removeChild(pointerSpace);
    }, 400)
    setInterval(() => { 
        logContainer.appendChild(pointerSpace);
        logContainer.removeChild(pointer);
    }, 800)

    sendButton.addEventListener('click', sendJson);
    function sendJson() 
    {
        const id_msg = document.getElementById('id-msg');
        const id_target = document.getElementById('id-target');
        const data = document.getElementById('textInput');

        const jsonData = {
        id_msg: parseInt(id_msg.value),
        id_target: parseInt(id_target.value),
        msg: data.value
        };
        socket.emit('Send-To-Can', jsonData);
    }

    setInterval(function () {
        $("#time").html(dayjs().format("HH:mm DD/MM/YYYY"));
    }, 1000);
})
