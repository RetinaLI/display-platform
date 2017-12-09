(function() {

    //一周安装情况
    var myWeek6AddInfoChart;
    var optionWeek6AddInfo;
    var xAxisWeek6Data = [];
    var markPointWeek6OnlineData = [];

    //各品牌车辆在线情况
    var myCarBrandAddAndRunInfoChart;
    var optionCarBrandAddAndRunInfo;
    var xAxisAddAndRunData = [];
    var seriesAddData = [];
    var markPointAddData = [];

    //各品牌车辆运行情况
    var myCarBrandRunInfoChart;
    var xAxisRunInfoData = [];
    var seriesRunInfoData = [];
    var seriesRunTimeData = [];
    var markPointRunMileageData = [];
    var markPointRunTimeData = [];

    //各品牌车辆运行平均情况
    var myCarBrandAvgRunChart;
    var optionCarBrandAvgRun;
    var xAxisAvgRunData = [];
    var seriesAvgMileageData = [];
    var seriesAvgTimeData = [];
    var markPointAvgTimeData = [];
    var markPointAvgMileageData = [];

    //运营平均里程分布情况
    var myOperateAvgMileageChart;
    var optionOperateAvgMileage;
    var yAxisOperateMileageAvgData = [];
    var seriesOperateMileageAvgData = [];

    //运营平均速度分布情况
    var myOperateAvgVelocityChart;
    var optionOperateAvgVelocity;
    var yAxisOperateAvgVelocityData = [];
    var seriesOperateAvgVelocityData = [];

    //运营出勤率分布情况
    var myOperateAttendanceChart;
    var yAxisOperateAttendanceData = [];
    var seriesOperateAttendanceData = [];

    var carBrandMap = {};

    var result;

    var markPointWeek6OnlineDataCars = [];

    function resizeChart() {
        myOperateAttendanceChart && myOperateAttendanceChart.resize();
        myOperateAvgVelocityChart && myOperateAvgVelocityChart.resize();
        myOperateAvgMileageChart && myOperateAvgMileageChart.resize();
        myCarBrandAvgRunChart && myCarBrandAvgRunChart.resize();
        myCarBrandRunInfoChart && myCarBrandRunInfoChart.resize();
        myCarBrandAddAndRunInfoChart && myCarBrandAddAndRunInfoChart.resize();
        myWeek6AddInfoChart && myWeek6AddInfoChart.resize();
    }

    var getUrlParams = function() {
        var params = {};
        var paramList = window.location.search.substring(1).split("&");
        var len = paramList.length;
        for (var i = 0; i < len; i += 1) {
            var _p = paramList[i],
                _index = _p.indexOf("=");
            if (_index > -1) {
                if (_index === 0) continue;
                params[decodeURIComponent(_p.split("=")[0])] = decodeURIComponent(_p.substr(_index + 1));
            } else {
                params[decodeURIComponent(_p)] = null;
            }
        }
        return params;
    };

    function changeOptions() {
        var url = getUrlParams().data || "";
        // var url = "./assets/50121_20170906.json";
        $.ajax({
            type: "get",
            url: url,
            dataType: "json",
            success: function(_result) {
                result = _result;
                //一周安装情况Echart图
                xAxisWeek6Data = result.optionWeek6AddInfo.totalJson.xData;

                for (i = 0; i < xAxisWeek6Data.length; i++) {
                    carBrandMap[xAxisWeek6Data[i]] = 1;
                }

                markPointWeek6OnlineData = result.optionWeek6AddInfo.totalJson.markPointData;
                markPointWeek6OnlineData.sort(function(a, b){ return b.value - a.value; }).splice(6);

                for (i = 0; i < markPointWeek6OnlineData.length; i++) {
                    markPointWeek6OnlineDataCars.push(markPointWeek6OnlineData[i].name);
                }

                $('#carBrandAddNum').html(result.optionWeek6AddInfo.totalJson.carTotalNum);
                $('#carBrandNewNum').html(result.optionWeek6AddInfo.totalJson.addCarNum1);
                $('#lastNewAdd').html(result.optionWeek6AddInfo.totalJson.addCarNum2);
                var addRate = result.optionWeek6AddInfo.totalJson.addRate;
                if (addRate > 0) {
                    $('#weekRateName').html("环比增长");
                    $('#weekRate').html(addRate);
                } else {
                    $('#weekRateName').html("环比下降");
                    $('#weekRate').html(Math.abs(addRate));
                }

                $('#carBrandAddStartDate').html(result.optionWeek6AddInfo.section[0]);
                $('#carBrandAddEndDate').html(result.optionWeek6AddInfo.section[1]);
                $('#pushDate').html(result.optionWeek6AddInfo.totalJson.sendTime.split(" ")[0]);

                //各品牌车辆运行情况
                xAxisRunInfoData = result.optionCarBrandRunInfo.xAxisRunInfoData;
                seriesRunInfoData = result.optionCarBrandRunInfo.seriesMileAgeData;
                seriesRunTimeData = result.optionCarBrandRunInfo.seriesRunTimeData;
                markPointRunMileageData = result.optionCarBrandRunInfo.markPointMileageData;
                markPointRunTimeData = result.optionCarBrandRunInfo.markPointRunTimeData;
                $('#total').html(Math.round(result.optionCarBrandRunInfo.totalJson.carNum / 10000));
                $('#mileage').html(result.optionCarBrandRunInfo.totalJson.mileAge);
                $('#hours').html(result.optionCarBrandRunInfo.totalJson.runTime);
                $('#locationTotal').html(result.optionCarBrandRunInfo.totalJson.LocationNum);
                $('#canTotal').html(result.optionCarBrandRunInfo.totalJson.CanNum);
                $('#alertTotal').html(result.optionCarBrandRunInfo.totalJson.AlarmNum);

                var i = 0;
                var html = '<tr><th class = "sort-number">序号</th><th>品牌名称</th><th>车辆数</th><th>总运营里程<br/>(万公里) </th><th>总运营时长<br/>(万小时)</th>';
                $("#runInfo_list").html(html);
                $.each(result.optionCarBrandRunInfo.OnlineData, function(index, _OnlineData) {
                    if (result.optionCarBrandRunInfo.OnlineData.length > 6) {
                        if (i < 6) {
                            $.each(_OnlineData, function(key, value) {
                                if (!carBrandMap[key]) return;
                                html += '<tr><td>' + (i + 1) + '</td>';
                                html += '<td>' + key + '</td>';
                                html += '<td class = "right">' + value.carNum + '</td>';
                                html += '<td class = "right">' + value.runTime + '</td>';
                                html += '<td class = "right">' + value.mileAge + '</td>';
                                i++;
                            })
                        }
                    } else {
                        if (i < result.optionCarBrandRunInfo.OnlineData.length) {
                            $.each(_OnlineData, function(key, value) {
                                if (!carBrandMap[key]) return;
                                html += '<tr><td>' + (i + 1) + '</td>';
                                html += '<td>' + key + '</td>';
                                html += '<td class = "right">' + value.carNum + '</td>';
                                html += '<td class = "right">' + value.runTime + '</td>';
                                html += '<td class = "right">' + value.mileAge + '</td>';
                                i++;
                            })
                        }
                    }

                });
                $("#runInfo_list").html(html);


                //运营平均里程分布情况
                yAxisOperateMileageAvgData = result.carAvgMileageReport.yAxisData;
                seriesOperateMileageAvgData = result.carAvgMileageReport.seriesData;
                $('#operateMileageFirstName').html(result.carAvgMileageReport.yAxisData[9]);
                $('#operateMileageSecondName').html(result.carAvgMileageReport.yAxisData[8]);
                $('#operateMileageThirdName').html(result.carAvgMileageReport.yAxisData[7]);
                $('#operateMileageFirstMileage').html(result.carAvgMileageReport.seriesData[9]);
                $('#operateMileageSecondMileage').html(result.carAvgMileageReport.seriesData[8]);
                $('#operateMileageThirdMileage').html(result.carAvgMileageReport.seriesData[7]);

                $('#operateMileageLastOneName').html(result.carAvgMileageReport.yAxisData[2]);
                $('#operateMileageLastTwoName').html(result.carAvgMileageReport.yAxisData[1]);
                $('#operateMileageLastThreeName').html(result.carAvgMileageReport.yAxisData[0]);
                $('#operateMileageLastOneMileage').html(result.carAvgMileageReport.seriesData[2]);
                $('#operateMileageLastTwoMileage').html(result.carAvgMileageReport.seriesData[1]);
                $('#operateMileageLastThreeMileage').html(result.carAvgMileageReport.seriesData[0]);

                //运营平均速度分布情况
                yAxisOperateAvgVelocityData = result.carAvgSpeedReport.yAxisData;
                seriesOperateAvgVelocityData = result.carAvgSpeedReport.seriesData;
                $('#operateAvgVelocityFirstName').html(result.carAvgSpeedReport.yAxisData[9]);
                $('#operateAvgVelocitySecondName').html(result.carAvgSpeedReport.yAxisData[8]);
                $('#operateAvgVelocityThirdName').html(result.carAvgSpeedReport.yAxisData[7]);
                $('#operateAvgVelocityFirstMileage').html(result.carAvgSpeedReport.seriesData[9]);
                $('#operateAvgVelocitySecondMileage').html(result.carAvgSpeedReport.seriesData[8]);
                $('#operateAvgVelocityThirdMileage').html(result.carAvgSpeedReport.seriesData[7]);

                $('#operateAvgVelocityLastOneName').html(result.carAvgSpeedReport.yAxisData[2]);
                $('#operateAvgVelocityLastTwoName').html(result.carAvgSpeedReport.yAxisData[1]);
                $('#operateAvgVelocityLastThreeName').html(result.carAvgSpeedReport.yAxisData[0]);
                $('#operateAvgVelocityLastOneMileage').html(result.carAvgSpeedReport.seriesData[2]);
                $('#operateAvgVelocityLastTwoMileage').html(result.carAvgSpeedReport.seriesData[1]);
                $('#operateAvgVelocityLastThreeMileage').html(result.carAvgSpeedReport.seriesData[0]);

                //运营出勤率分布情况
                yAxisOperateAttendanceData = result.carAttendanceReport.yAxisData;
                seriesOperateAttendanceData = result.carAttendanceReport.seriesData;
                $('#operateAttendanceFirstName').html(result.carAttendanceReport.yAxisData[9]);
                $('#operateAttendanceSecondName').html(result.carAttendanceReport.yAxisData[8]);
                $('#operateAttendanceThirdName').html(result.carAttendanceReport.yAxisData[7]);
                $('#operateAttendanceFirstMileage').html(result.carAttendanceReport.seriesData[9]);
                $('#operateAttendanceSecondMileage').html(result.carAttendanceReport.seriesData[8]);
                $('#operateAttendanceThirdMileage').html(result.carAttendanceReport.seriesData[7]);

                $('#operateAttendanceLastOneName').html(result.carAttendanceReport.yAxisData[2]);
                $('#operateAttendanceLastTwoName').html(result.carAttendanceReport.yAxisData[1]);
                $('#operateAttendanceLastThreeName').html(result.carAttendanceReport.yAxisData[0]);
                $('#operateAttendanceLastOneMileage').html(result.carAttendanceReport.seriesData[2]);
                $('#operateAttendanceLastTwoMileage').html(result.carAttendanceReport.seriesData[1]);
                $('#operateAttendanceLastThreeMileage').html(result.carAttendanceReport.seriesData[0]);

                initChart();
            }
        });
    }

    //一周安装情况Echart图
    function initWeek6AddInfoEchart() {
        myWeek6AddInfoChart = myWeek6AddInfoChart || echarts.init(document.getElementById('week6AddInfo'), "macarons");
        optionWeek6AddInfo = {
            tooltip: {
                show: false,
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                top: document.documentElement.clientWidth >= 720 ? "15px" : '5%',
                right: document.documentElement.clientWidth >= 720 ? "10%" : '0%',
                data: xAxisWeek6Data,
                formatter: function(value){
                    return value.substr(0, 3) + "\n" + value.substr(3);
                }
            },
            series: [{
                name: '新增车辆数',
                silent: true,
                type: 'pie',
                radius: document.documentElement.clientWidth >= 720 ? "70%" : '43%',
                center: document.documentElement.clientWidth >= 720 ? ["50%", "50%"] : ['40%', '40%'],
                itemStyle: {
                    normal: {
                        color: function(params) {
                            //首先定义一个数组
                            var colorList = ["#2382d3", "#ff5608", "#ffc000", "#baeaf1", "#ffe7b0", '#92d050', "#01c0c8", '#00b0f0'];
                            return colorList[params.dataIndex]
                        },
                        //以下为是否显示
                        label: {
                            show: true
                        }
                    },
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                },
                data: markPointWeek6OnlineData
            }]
        };
        myWeek6AddInfoChart.setOption(optionWeek6AddInfo, { notMerge: true });
        myWeek6AddInfoChart.resize();
    }

    //各品牌车辆在线情况Echart图
    function initCarBrandAddAndRunInfoEchart() {
        var html = '<tr><th class="sort-number">序号</th><th>品牌名称</th><th>在线数<br/>(辆)</th><th>在线率<br/>(%)</th>';
        //各品牌在线情况
        var Q3AddData = result.optionCarBrandAddAndRunInfo.Q3AddData;

        if (result.optionCarBrandAddAndRunInfo.xAxisAddAndRunData.length > 6) {
            for (i = 0; i < 6; i++) {
                xAxisAddAndRunData[i] = (result.optionCarBrandAddAndRunInfo.xAxisAddAndRunData[i]);
                seriesAddData[i] = result.optionCarBrandAddAndRunInfo.seriesAddData[i];
                markPointAddData[i] = result.optionCarBrandAddAndRunInfo.markPointAddData[i];
                html += '<tr><td>' + (i + 1) + '</td>';
                html += '<td>' + Q3AddData[i].name + '</td>';
                html += '<td>' + Q3AddData[i].onLine + '</td>';
                html += '<td>' + Q3AddData[i].onLineRate + '</td>';
            }
        } else {
            xAxisAddAndRunData = (result.optionCarBrandAddAndRunInfo.xAxisAddAndRunData);
            seriesAddData = result.optionCarBrandAddAndRunInfo.seriesAddData;
            markPointAddData = result.optionCarBrandAddAndRunInfo.markPointAddData;
            for (var i = 0; i < result.optionCarBrandAddAndRunInfo.xAxisAddAndRunData.length; i++) {
                html += '<tr><td>' + (i + 1) + '</td>';
                html += '<td>' + Q3AddData[i].name + '</td>';
                html += '<td>' + Q3AddData[i].onLine + '</td>';
                html += '<td>' + Q3AddData[i].onLineRate + '</td>';
            }
        }
        $("#online_list").html(html);

        $('#carBrandOnlineNum').html(Math.round(result.optionCarBrandAddAndRunInfo.onlineData.carOnlineNum / 10000));
        $('#carBrandOnlineRate').html(result.optionCarBrandAddAndRunInfo.onlineData.carOnlineRate);


        myCarBrandAddAndRunInfoChart = myCarBrandAddAndRunInfoChart || echarts.init(document.getElementById('carBrandAddAndRunInfo'), "macarons");
        optionCarBrandAddAndRunInfo = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross'
                }
            },
            calculable: true,
            tooltip: { show: false },
            grid:{
              left: "13%",
              right: "13%"
            },
            xAxis: [{
                "axisLabel": {
                    "interval": 0,
                    "show": true,
                    "rotate": "-60",
                    "textStyle": {
                        "fontFamily": "微软雅黑",
                        "fontSize": 12
                    }
                },
                type: 'category',
                name: '品牌',
                data: xAxisAddAndRunData
            }],
            yAxis: [{
                type: 'value',
                name: '在线率(%)',
                min: 0,
                max: 100,
                axisLabel: {
                    formatter: "{value}%"
                }
            }],
            series: [{
                name: '在线率(%)',
                type: 'line',
                silent: true,
                lineStyle: {
                    normal: {
                        color: "#00b0f0"
                    }
                },
                itemStyle: {
                    normal: {
                        color: "#00b0f0"
                    }
                },
                data: seriesAddData,
                markPoint: {
                    data: markPointAddData,
                    label: {
                        normal: {
                            backgroundColor: "#00b0f0",
                            color: "red"
                        }
                    }
                }
            }]
        };
        myCarBrandAddAndRunInfoChart.setOption(optionCarBrandAddAndRunInfo, { notMerge: true });
        myCarBrandAddAndRunInfoChart.resize();
    }

    //各品牌车辆运行平均情况Echart图
    function initCarBrandAvgRunEchart() {
        var html = '<tr><th class="sort-number">序号</th><th>品牌名称</th><th>平均运营里程<br/>(公里)</th><th>平均运营时长<br/>(小时)</th>';
        //各品牌车辆运行平均情况
        if (result.carOperateAvgReport.xAxisAvgRunData.length > 6) {
            for (i = 0; i < 6; i++) {
                xAxisAvgRunData[i] = result.carOperateAvgReport.xAxisAvgRunData[i];
                seriesAvgMileageData[i] = result.carOperateAvgReport.seriesAvgMileageData[i];
                seriesAvgTimeData[i] = result.carOperateAvgReport.seriesAvgTimeData[i];
                markPointAvgTimeData[i] = result.carOperateAvgReport.markPointAvgTimeData[i];
                markPointAvgMileageData[i] = result.carOperateAvgReport.markPointAvgMileageData[i];
                html += '<tr><td>' + (i + 1) + '</td>';
                html += '<td>' + result.carOperateAvgReport.xAxisAvgRunData[i] + '</td>';
                html += '<td>' + result.carOperateAvgReport.seriesAvgMileageData[i] + '</td>';
                html += '<td>' + result.carOperateAvgReport.seriesAvgTimeData[i] + '</td>';
            }
        } else {
            xAxisAvgRunData = result.carOperateAvgReport.xAxisAvgRunData;
            seriesAvgMileageData = result.carOperateAvgReport.seriesAvgMileageData;
            seriesAvgTimeData = result.carOperateAvgReport.seriesAvgTimeData;
            markPointAvgTimeData = result.carOperateAvgReport.markPointAvgTimeData;
            markPointAvgMileageData = result.carOperateAvgReport.markPointAvgMileageData;
            for (var i = 0; i < result.carOperateAvgReport.xAxisAvgRunData.length; i++) {
                html += '<tr><td>' + (i + 1) + '</td>';
                html += '<td>' + result.carOperateAvgReport.xAxisAvgRunData[i] + '</td>';
                html += '<td>' + result.carOperateAvgReport.seriesAvgMileageData[i] + '</td>';
                html += '<td>' + result.carOperateAvgReport.seriesAvgTimeData[i] + '</td>';
            }
        }
        var max_time = Math.max.apply(null, seriesAvgTimeData) + 10;
        $("#avgRun_list").html(html);
        myCarBrandAvgRunChart = myCarBrandAvgRunChart || echarts.init(document.getElementById('carBrandChartAvgRun'), "macarons");
        optionCarBrandAvgRun = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross'
                }
            },
            legend: {
                x: 'center',
                y: 'bottom',
                data: ['里程（公里）', '时间（小时）']
            },
            calculable: true,
            tooltip: { show: false },
            grid: {
                left: document.documentElement.clientWidth >= 720 ? "7%" : '1%',//'7%',
                right: document.documentElement.clientWidth >= 720 ? "7%" : '5%',//'7%',
                top: '7%',
                bottom: "15%",
                containLabel: true
            },
            xAxis: [{
                "axisLabel": {
                    "interval": 0,
                    "show": true,
                    "rotate": "-45",
                    "textStyle": {
                        "fontFamily": "微软雅黑",
                        "fontSize": 12
                    }
                },
                type: 'category',
                name: '品牌',
                data: xAxisAvgRunData
            }],
            yAxis: [{
                type: 'value',
                name: '里程（公里）',
                max: seriesAvgMileageData[0] && seriesAvgMileageData[0] + 1000
            }, {
                type: 'value',
                name: '时间(小时)',
                max: max_time
            }],
            series: [{
                    name: '里程（公里）',
                    type: 'bar',
                    silent: true,
                    data: seriesAvgMileageData,
                    label: {
                        normal: {
                            color: "#92d050"
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: "#92d050",
                            //以下为是否显示 
                            label: {
                                show: false
                            }
                        }
                    },
                    markPoint: {
                        data: markPointAvgMileageData
                    }
                },
                {
                    name: '时间（小时）',
                    type: 'line',
                    silent: true,
                    yAxisIndex: 1,
                    data: seriesAvgTimeData,
                    itemStyle: {
                        normal: {
                            color: "#ffc000",
                            //以下为是否显示 
                            label: {
                                show: false
                            }
                        }
                    },
                    lineStyle: {
                        normal: {
                            color: "#ffc000",
                            //以下为是否显示 
                            label: {
                                show: false
                            }
                        }
                    },
                    markPoint: {
                        data: markPointAvgTimeData
                    }
                }
            ]
        };
        myCarBrandAvgRunChart.setOption(optionCarBrandAvgRun, { notMerge: true });
        myCarBrandAvgRunChart.resize();
    }

    //运营里程分布情况Echart图
    function initOperateMileageAvgEchart() {
        myOperateAvgMileageChart = myOperateAvgMileageChart || echarts.init(document.getElementById('operateAvgMileageChart'), "macarons");

        optionOperateAvgMileage = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            calculable: true,
            tooltip: { show: false },
            grid: {
                left: document.documentElement.clientWidth >= 720 ? "7%" : '1%',//'7%',
                right: document.documentElement.clientWidth >= 720 ? "7%" : '3%',//'7%',
                top: '0%',
                bottom: 0,
                containLabel: true
            },
            xAxis: [{
                type: 'value',
                boundaryGap: [0, 0.01],
                max: Number(seriesOperateMileageAvgData.slice(-1)) + 120
            }],
            yAxis: [{
                "axisLabel": {
                    formatter: function(value) {
                        return value.substr(0, 4) + "\n" + value.substr(4);
                    },
                    "interval": 0,
                    "show": true,
                    "textStyle": {
                        "fontFamily": "微软雅黑",
                        "fontSize": 12
                    }
                },
                type: 'category',
                data: yAxisOperateMileageAvgData
            }],
            series: [{
                silent: true,
                itemStyle: {
                    normal: {
                        color: function(params) {
                            //首先定义一个数组 
                            var colorList = ["#99e636", "#99e636", "#99e636", "#99e636", "#99e636", '#92d050', '#92d050', '#92d050', '#92d050', '#92d050'];
                            return colorList[params.dataIndex]
                        },
                        //以下为是否显示 
                        label: {
                            show: false
                        }
                    }
                },
                label: {
                    normal: {
                        formatter: '{c}公里',
                        position: 'right',
                        show: true
                    }
                },
                name: '里程',
                type: 'bar',
                data: seriesOperateMileageAvgData
            }]
        };
        myOperateAvgMileageChart.setOption(optionOperateAvgMileage, { notMerge: true });
        myOperateAvgMileageChart.resize();
    }

    //运营平均速度分布情况Echart图
    function initOperateAvgVelocityEchart() {
        myOperateAvgVelocityChart = myOperateAvgVelocityChart || echarts.init(document.getElementById('operateAvgVelocityChart'), "macarons");
        optionOperateAvgVelocity = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            calculable: true,
            tooltip: { show: false },
            grid: {
                left: document.documentElement.clientWidth >= 720 ? "7%" : '1%',//'7%',
                right: document.documentElement.clientWidth >= 720 ? "7%" : '3%',//'7%',
                top: '0%',
                bottom: 0,
                containLabel: true
            },
            xAxis: [{
                type: 'value',
            }],
            yAxis: [{
                "axisLabel": {
                    formatter: function(value) {
                        return value.substr(0, 4) + "\n" + value.substr(4);
                    },
                    "interval": 0,
                    "show": true,
                    "textStyle": {
                        "fontFamily": "微软雅黑",
                        "fontSize": 12
                    }
                },
                type: 'category',
                data: yAxisOperateAvgVelocityData
            }],
            series: [{
                silent: true,
                itemStyle: {
                    normal: {
                        color: function(params) {
                            //首先定义一个数组 
                            var colorList = ['#ffe7b0', '#ffe7b0', '#ffe7b0', '#ffe7b0', '#ffe7b0', "#ffc302", "#ffc302", "#ffc302", "#ffc302", "#ffc302"];
                            return colorList[params.dataIndex]
                        },
                        //以下为是否显示 
                        label: {
                            show: false
                        }
                    }
                },
                label: {
                    normal: {
                        show: true,
                        formatter: '{c}KM/H',
                        position: 'insideRight'
                    }
                },
                name: '平均速度',
                type: 'bar',
                data: seriesOperateAvgVelocityData
            }]
        };
        myOperateAvgVelocityChart.setOption(optionOperateAvgVelocity, { notMerge: true });
        myOperateAvgVelocityChart.resize();
    }

    //运营出勤率分布情况Echart图
    function initOperateAttendanceEchart() {
        myOperateAttendanceChart = myOperateAttendanceChart || echarts.init(document.getElementById('operateAttendanceChart'), "macarons");
        optionOperateAvgVelocity = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            tooltip: { show: false },
            calculable: true,
            grid: {
                left: document.documentElement.clientWidth >= 720 ? "7%" : '1%',//'7%',
                right: document.documentElement.clientWidth >= 720 ? "7%" : '3%',//'7%',
                top: "0",
                bottom: 0,
                containLabel: true
            },
            xAxis: [{
                type: 'value',
                //boundaryGap: [0, 0.01]
            }],
            yAxis: [{
                "axisLabel": {
                    formatter: function(value) {
                        return value.substr(0, 4) + "\n" + value.substr(4);
                    },
                    "interval": 0,
                    "show": true,
                    "textStyle": {
                        "fontFamily": "微软雅黑",
                        "fontSize": 12,
                        "color": "#4f4f4f"
                    }
                },
                type: 'category',
                data: yAxisOperateAttendanceData
            }],
            series: [{
                silent: true,
                itemStyle: {
                    normal: {
                        color: function(params) {
                            //首先定义一个数组 
                            var colorList = ["#64baf9", "#64baf9", "#64baf9", "#64baf9", "#64baf9", '#2382d3', '#2382d3', '#2382d3', '#2382d3', '#2382d3'];
                            return colorList[params.dataIndex]
                        },
                        //以下为是否显示 
                        label: {
                            formatter: '{c}%',
                            show: false
                        }
                    }
                },
                label: {
                    normal: {
                        show: true,
                        position: 'insideRight'
                    }
                },
                name: '出勤率',
                type: 'bar',
                data: seriesOperateAttendanceData
            }]
        };
        myOperateAttendanceChart.setOption(optionOperateAvgVelocity, { notMerge: true });
        myOperateAttendanceChart.resize();
    }

    function initChart() {

        initWeek6AddInfoEchart(); //近一周安装情况
        initCarBrandAddAndRunInfoEchart(); //各品牌车辆在线情况
        initCarBrandAvgRunEchart(); //各品牌车辆运行平均情况
        initOperateMileageAvgEchart(); //运营平均里程分布情况
        initOperateAvgVelocityEchart(); //运营平均速度分布情况
        initOperateAttendanceEchart(); //运营出勤率分布情况

    }

    window.beforeStartLoad = function(callback) {
        callback();
    };
    window.initApp = function() {
        changeOptions();


        ZBase.Event.add("html-font-size-changed", function() {
            initChart();
        });
    };
})();