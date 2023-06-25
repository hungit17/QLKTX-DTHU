var roomChart = {
    init: function() {
        roomChart.showChartByGender();
        roomChart.showChartByDepartment();
    },
showChartByGender: function () {
        var ctx = document.getElementById('_emtyRoom').getContext('2d');
        $.ajax({
            url: '/Room/GetChart',
            type: 'get',
            dataType: 'json',
            success: function (res) {
                var roomStatus = res.roomStatus;
                var repartition = res.repartition;
                var chart = new Chart(ctx, {
                    // The type of chart we want to create
                    type: 'pie',

                    // The data for our dataset
                    data: {
                        labels: ["Đã thuê", "Còn trống"],
                        datasets: [{
                            label: "Thống kê phòng",
                            backgroundColor: ["rgb(233, 30, 99)",
                                "rgb(255, 193, 7)"],
                            borderColor: 'rgb(255, 99, 132)',
                            data: repartition,
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

    },
showChartByDepartment: function () {
    var ctx = document.getElementById('_StudentByDepartment').getContext('2d');
    $.ajax({
        url: '/Students/StudentByDepartment',
        type: 'get',
        dataType: 'json',
        success: function (res) {
            var Name = res.DepartmentName;
            var data = res.repartition;
            var chart = new Chart(ctx, {
                // The type of chart we want to create
                type: 'bar',

                // The data for our dataset
                data: {
                    labels: Name,
                    datasets: [{
                        label: "Thống kê số lượng sinh viên theo từng khoa",
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
},
}
roomChart.init();

