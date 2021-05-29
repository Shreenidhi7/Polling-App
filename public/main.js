const form = document.getElementById("vote-form");

// Form Submit Event
form.addEventListener("submit", (event) => {
  const choice = document.querySelector("input[name=author]:checked").value;
  const data = { author: choice };

  fetch("http://localhost:3000/poll", {
    method: "post",
    body: JSON.stringify(data),
    headers: new Headers({
      "Content-Type": "application/json",
    }),
  })
    .then((res) => res.json())
    .then((data) => console.log("data :", data))
    .catch((err) => console.log(err));

  event.preventDefault();
});

fetch("http://localhost:3000/poll")
  .then((res) => res.json())
  .then((data) => {
    let votes = data.votes;
    let totalVotes = votes.length;

    let voteCounts = {
      MdC: 0,
      CD: 0,
      JRRT: 0,
      AdS: 0,
    };

    voteCounts = votes.reduce(
      (acc, vote) => (
        (acc[vote.author] = (acc[vote.author] || 0) + parseInt(vote.points)),
        acc
      ),
      {}
    );

    let dataPoints = [
      { label: "Miguel de Cervantes", y: voteCounts.MdC },
      { label: "Charles Dickens", y: voteCounts.CD },
      { label: "J.R.R.Tolkien", y: voteCounts.JRRT },
      { label: "Antoine de Saint-Exuper", y: voteCounts.AdS },
    ];

    let chartContainer = document.querySelector("#chartContainer");

    if (chartContainer) {
      // Column Chart
      var chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: true,
        theme: "theme1",
        title: {
          text: `Total Votes ${totalVotes}`,
        },
        data: [
          {
            type: "column",
            dataPoints: dataPoints,
          },
        ],
      });

      setTimeout(function () {
        // Pie Chart
        var chart = new CanvasJS.Chart("chartContainer", {
          exportEnabled: true,
          animationEnabled: true,
          title: {
            text: `Total Votes : ${totalVotes}`,
          },
          legend: {
            fontSize: 16,
            fontWeight: "bold",
            itemWidth: 180,
          },

          data: [
            {
              type: "pie",
              startAngle: 120,
              toolTipContent: "<b>{label} : {y} </b>",
              showInLegend: "true",
              legendText: "{label}",
              indexLabelFontSize: 18,
              indexLabel: "{label} : {y}",
              dataPoints: dataPoints,
            },
          ],
        });

        checkForZeroDps(chart);

        chart.render();

        Pusher.logToConsole = true;

        var pusher = new Pusher("ec54381cbde412d99039", {
          cluster: "ap2",
        });

        function checkForZeroDps(chart) {
          console.log("zero?", chart);
          var isDpsZero = false;
          for (var i = 0; i < chart.options.data[0].dataPoints.length; i++) {
            if (chart.options.data[0].dataPoints[i].y === undefined) {
              console.log("1", chart.options.data[0].dataPoints[i].y);
              isDpsZero = true;
            }
          }
          console.log(isDpsZero);
          if (isDpsZero) {
            chart.options.title.text = null;
            chart.options.exportEnabled = null;
            chart.options.data[0].indexLabel = null;
            chart.options.legend = null;
            chart.options.data[0].type = "none";
          }
        }

        var channel = pusher.subscribe("author-poll");
        channel.bind("author-vote", function (data) {
          console.log("data =>", data);
          dataPoints = dataPoints.map((x) => {
            if (x.label == data.author) {
              x.y += data.points;
              return x;
            } else {
              return x;
            }
          });
          chart.render();
        });
      }, 1000);
    }
  });
