var rightLight = 0;
var leftLight = 0;
$.when(
  $.getScript('./configClient/config.js',function(){
      Socket_hostIP = hostIP;
      Socket_port = port;
  })).done(function(){
    setInterval(function () {
      $("#time").html(dayjs().format("HH:mm DD/MM/YYYY"));
      }, 1000);
      
      var mymap = L.map("map").setView([10.8696406, 106.8025968], 18);
      
      L.tileLayer("assets/map/{z}/{x}/{y}.png", { maxZoom: 19, minZoom: 17 }).addTo(
      mymap
      );
      const setSpeed = (speed) => {
      $("#speed_wheel_pointer").css(  
        "transform",
        `rotate(${-132 + (speed / 180) * 255}deg)`
      );
      };
      
        setInterval(() => { if (leftLight) {
                            $("#light-t-l").addClass("light--active")
                            $("#light-b-l").addClass("light--active") }
                          }, 500)
        setInterval(() => { if (leftLight) {
                            $("#light-t-l").removeClass("light--active")
                            $("#light-b-l").removeClass("light--active")}
                          }, 1000)
      
      
      {
      setInterval(() => { if (rightLight) {$("#light-t-r").addClass("light--active")
                          $("#light-b-r").addClass("light--active")
      }}, 500)
      setInterval(() => { if (rightLight) {$("#light-t-r").removeClass("light--active")
                          $("#light-b-r").removeClass("light--active")
      }}, 1000)
      }
      // setInterval(() => setSpeed(Math.floor(Math.random() * 100)), 100);
      socket = io.connect('http://' + Socket_hostIP + ':' + Socket_port, { transports : ['websocket'] });
      socket.on("Status-Light", (data)=>{
        console.log(data);
        $("#light-t-r").removeClass("light--active")
        $("#light-t-l").removeClass("light--active")
        $("#light-b-l").removeClass("light--active")
        $("#light-b-r").removeClass("light--active")
        switch (data.toString()) {
          case "r":
            leftLight = 0;
            rightLight = 1;
            break;
          case "l":
            leftLight = 1;
            rightLight = 0;
            break;
          default:
            leftLight = 0;
            rightLight = 0;
            break;
        }
      })
      socket.on("Status-Speed", (data)=>{
        console.log(data);
        setSpeed(parseInt(data));
      })
})
