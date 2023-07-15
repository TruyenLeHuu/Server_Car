$.when(
  $.getScript('./configClient/config.js',function(){
      Socket_hostIP = hostIP;
      Socket_port = port;
  })).done(function(){
    const sendButton = document.getElementById('sendButton');
    const clearButton = document.getElementById('clearButton');
    const historyButton = document.getElementById('historyButton');
    const filterButton = document.getElementById('filterButton');
    const clearFilterButton = document.getElementById('clearFilterButton');

    const logContainer = document.getElementById('logContainer');
    const logHistoryContainer = document.getElementById('logHistoryContainer');
    const realtimeLog = document.getElementById('realtime-log');
    const historyLog = document.getElementById('history-log');
    var log;
    historyLog.style.display = 'none';
    socket = io.connect('http://' + Socket_hostIP + ':' + Socket_port, { transports : ['websocket'] });

    socket.on('Log-msg', function(data) {
        log.push(data);
        logData(data);
        logHistoryData(data);
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
    socket.emit('get-log');
    socket.on('history-log', (data)=>{
        // console.info(data);
        log = data;
        logHistoryContainer.innerHTML = '';
        data.forEach((jsonString, index) => {
            try {
                const jsonData = JSON.parse(jsonString);
                logHistoryData(jsonData) 
              console.log(`Json string ${index + 1}:`, jsonData.time);
            } catch (error) {
              console.error(`Json string error num${index + 1}:`, error);
            }
          })
    })
    function logHistoryData(data) {
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
        logHistoryContainer.appendChild(logItem);
        
        logHistoryContainer.scrollTop = logHistoryContainer.scrollHeight;
    }
    historyButton.addEventListener('click', async()=>{
        if (historyLog.style.display === 'none') {
            historyLog.style.display = 'block';
            realtimeLog.style.display = 'none';
            historyButton.textContent = 'Realtime log';
          } else {
            historyLog.style.display = 'none';
            realtimeLog.style.display = 'block';
            historyButton.textContent = 'History log';
          }
    });
    filterButton.addEventListener('click', filter);
    function filter() 
    {
        logHistoryContainer.innerHTML = '';
        const filter_msg = document.getElementById('topic-filter-msg');
        log.forEach((jsonString, index) => {
            try {
                const jsonData = JSON.parse(jsonString);
                if (jsonData.topic === filter_msg.value)
                logHistoryData(jsonData)
            //   console.log(`Json string ${index + 1}:`, jsonData.time);
            } catch (error) {
              console.error(`Json string error num${index + 1}:`, error);
            }
          })
    }
    clearFilterButton.addEventListener('click', ()=>{
        socket.emit('get-log');});
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
        logContainer.appendChild(pointerSpace);
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
        msg: data.value + "\r\n"
        };
        socket.emit('Send-To-Can', jsonData);
    }
    clearButton.addEventListener('click', ()=>{
        logContainer.innerHTML = '';
    });

    setInterval(function () {
        $("#time").html(dayjs().format("HH:mm DD/MM/YYYY"));
    }, 1000);
})
