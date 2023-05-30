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
    `rotate(${-128 + (speed / 180) * 255}deg)`
  );
};
setSpeed();
setInterval(() => setSpeed(Math.floor(Math.random() * 180)), 100);
setInterval(() => $("#light-t-l").addClass("light--active"), 5000);
$("dialog").show();
