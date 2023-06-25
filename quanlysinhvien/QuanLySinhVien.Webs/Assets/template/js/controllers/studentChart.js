var studentChart = {
    init: function() {
        studentChart.showChartByGender();
    },
showChartByGender: function () {
    var ctx = document.getElementById('_StudentByGender').getContext('2d');
    $.ajax({
        url: '/Students/Student_Chart',
        type: 'get',
        dataType: 'json',
        success: function (res) {
            var gender = res.Gender;
            var data = res.repartition;
            var chart = new Chart(ctx, {
                // The type of chart we want to create
                type: 'pie',

                // The data for our dataset
                data: {
                    labels: ["Nam", "Nữ"],
                    datasets: [{
                        label: "Thống kê sinh viên nam nữ",
                        backgroundColor: ["rgb(233, 30, 99)",
                            "rgb(255, 193, 7)"],
                        borderColor: 'rgb(255, 99, 132)',
                        data: data,
                    }]
                },
                // Configuration options go here
                options: {
                    maintainAspecRatio: false,
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    }

                }
            });
        }
    });
    }
}
studentChart.init();

