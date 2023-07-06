var rightLight = 0;
var leftLight = 0;
$.when(
  $.getScript('./configClient/config.js',function(){
      Socket_hostIP = hostIP;
      Socket_port = port;
  })).done(function(){
      var velocityData = [25, 26, 27, 28, 29, 25, 26, 50, 28, 29, 25, 26, 27, 28, 29, 25, 26, 27, 28, 29, 25, 26, 27, 28, 29, 25, 26, 27, 28, 29 ]; 
      var powerData = [60, 62, 64, 65, 63, 60, 62, 64, 65, 63, 60, 62, 64, 65, 63, 60, 62, 64, 65, 63, 60, 62, 64, 65, 63, 60, 62, 64, 65, 63 ]; 
      var mymap = L.map("map").setView([10.8696406, 106.8025968], 18);
      setInterval(function () {
        $("#time").html(dayjs().format("HH:mm DD/MM/YYYY"));
      }, 1000);
      const powerCanvas = document.getElementById('powerChart');
      const velocityCanvas = document.getElementById('velocityChart');

      const ctx1 = powerCanvas.getContext('2d');
      const ctx2 = velocityCanvas.getContext('2d');

      const powerChart = new Chart(ctx1, {
        type: 'line',
        data: {
          labels: Array.from({ length: powerData.length }, (_, i) => i + 1),
          datasets: [{
            label: 'Power',
            data: powerData,
            fill: false,
            borderColor: '#ff6384',
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: false
            }
          },
          plugins: {
            legend: {
              display: false
            },
            title: {
              display: true,
              text: 'Power (W)'
            }
          }
          
        }
      });
    
      const velocityChart = new Chart(ctx2, {
        type: 'line',
        data: {
          labels: Array.from({ length: velocityData.length }, (_, i) => i + 1),
          datasets: [{
            label: 'Velocity',
            data: velocityData,
            fill: false,
            borderColor: '#36a2eb',
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: false
            }
          },
          plugins: {
            legend: {
              display: false
            },
            title: {
              display: true,
              text: 'Velocity (km/h)'
            }
          }
        }
      });

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
