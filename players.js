var w = 800;
var h = 600;
var margin = {
    top: 100,
    bottom: 40,
    left: 120,
    right: 60
};
var width = w - margin.left - margin.right;
var height = h - margin.top - margin.bottom;


var data;
var month = 'June'

d3.csv("data.csv", function (data1) {
    data = data1.filter(function (e) {
        return e.Split
    });
});
setTimeout(function () {
    var x = d3.scale.ordinal()
        .domain(data.map(function (e) {
            return e.Split
        }))
        .rangeBands([0, width])
    var y = d3.scale.linear()
        .domain([0, 0.5])
        .range([height, 0])

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient('bottom')
    var yAxis = d3.svg.axis()
        .scale(y)
        .orient('left')
        .ticks(10)
        .tickFormat(function (d) {
            return d.toFixed(3)
        })

    var line = d3.svg.line()
                .x(d => x(d.Split))
                .y(d => y(d.BA))
                .interpolate('cardinal')

    var colorScale = d3.scale.category10()
    var ordinalColorScale = d3.scale.category20()

    var xGridlines = d3.svg.axis()
        .scale(x)
        .tickSize(-height, -height)
        .tickFormat('')
        .tickValues(data.map(function (d) {
            return d.Split
        }))
        .orient('bottom')
    var yGridlines = d3.svg.axis()
        .scale(y)
        .tickSize(-width, 0, 0)
        .tickFormat('')
        .orient('left')

    var svg = d3.select("body").append("svg")
        .attr("id", "chart")
        .attr("width", w)
        .attr("height", h);
    var chart = svg.append('g')
        .classed('display', true)
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

    var controls = d3.select('body')
        .append('div')
        .attr('id', 'controls')
    var joe = controls.append('button')
        .html('Joe Mauer: show')
        .attr('state', 1)
    var byron = controls.append('button')
        .html('Byron Buxton: show')
        .attr('state', 1)
    var brian = controls.append('button')
        .html('Brian Dozier: show')
        .attr('state', 1)
    var eddie = controls.append('button')
        .html('Eddie Rosario: show')
        .attr('state', 1)
    var minesota = controls.append('button')
        .html('Minesota Twins: show')
        .attr('state', 1)

    function drawAxis(params) {
        if (params.initialize) {
            this.append('g')
                .classed('gridline x', true)
                .attr('transform', 'translate(0, ' + height + ')')
                .call(params.axis.gridlines.x)
            this.append('g')
                .classed('gridline y', true)
                .attr('transform', 'translate(0,0)')
                .call(params.axis.gridlines.y)
            this.append('g')
                .classed('axis x', true)
                .attr('transform', 'translate(0, ' + height + ')')
                .call(params.axis.x)
            this.append('g')
                .classed('axis y', true)
                .attr('transform', 'translate(0,0)')
                .call(params.axis.y)
            this.select('.y.axis')
                .append('text')
                .classed('y axis-label', true)
                .attr('transform', 'translate(-80, ' + height / 2 + ') rotate(-90)')
                .text('Batting Average')
            this.append('g')
                .append('text')
                .classed('chart-header', true)
                .attr('transform', 'translate(-30,-40)')
                .text('')
        }
    }

    function plot(params) {
        drawAxis.call(this, params)
        var list = []
        var list2 = ['Joe', 'Byron', 'Brian', 'Eddie', 'Minesota']
        var self = this
        let groupedData = params.data.reduce((cum, cur) => {
            if (!cum[cur.Player]) {
                cum[cur.Player] = [cur]
            } else {
                cum[cur.Player].push(cur)
            }
            return cum
        }, {})
        for (var val in groupedData) {
            list.push(groupedData[val])
        }
        this.selectAll('.stats')
            .data(list2)
            .enter()
            .append('g')
            .attr('class', d => d)
            .classed('stats', true)
        this.selectAll('.stats')
            .style('fill', function (d, i) {
                return colorScale(i)
            })

        list2.forEach((e, k) => {
            var g = self.selectAll('g.' + e)
            var arr = list[k].map((d, i) => {
                return {
                    key: e,
                    value: d.BA,
                    Player: d.Player,
                    BA: d.BA,
                    H: d.H,
                    Run: d.R,
                    HomeRun: d.HR,
                    Month: d.Split,
                    second: d['2B'],
                    Split: d.Split
                }
            })
            // enter()
            g.selectAll('.trendline')
                .data([arr])
                .enter()
                    .append('path')
                    .classed('trendline', true)
            g.selectAll('.response')
                .data(arr)
                .enter()
                .append('circle')
                .classed('response', true)
            // update
            g.selectAll('.trendline')
                .attr('d', d => line(d))
                .attr('transform', 'translate(' + width / 12 + ',0)')
            g.selectAll('.response')
                .attr('r', 6)
                .attr('cx', d => x(d.Split))
                .attr('cy', d => y(d.value))
                .attr('transform', 'translate(' + width / 12 + ',0)')
                .on('mouseover', function (d, i) {
                    var str = 'Player: ' + d.Player + ', '
                    str += 'Bating avg: ' + d.BA + ', '
                    str += 'Runs: ' + d.Run + ', '
                    str += 'Home Run: ' + d.HomeRun + ', '
                    str += 'Month: ' + d.Month + ', '
                    str += '2nd: ' + d.second 

                    d3.select('.chart-header').text(str)
                })
                .on('mouseout', function (d, i) {
                    d3.select('.chart-header').text('')
                })
            //exit()
            g.selectAll('.trendline')
                .data([arr])
                .exit()
                .remove()
            g.selectAll('.response')
                .data(arr)
                .exit()
                .remove()
        })
    }

    joe.on('click', function () {
        var self = d3.select(this)
        var state = +self.attr('state')
        var txt = 'Joe Mauer: '
        var hideShow = d3.selectAll('.Joe')
        var display = +hideShow.style('display')
        if (state === 0) {
            state = 1
            display = 'none'
            txt += 'show'
        } else if (state === 1) {
            state = 0;
            display = 'block'
            txt += 'hide'
        }
        hideShow.style('display', display)
        self.attr('state', state)
        self.html(txt)
    })
    byron.on('click', function () {
        var self = d3.select(this)
        var state = +self.attr('state')
        var txt = 'Byron Buxton: '
        var hideShow = d3.selectAll('.Byron')
        var display = +hideShow.style('display')
        if (state === 0) {
            state = 1
            display = 'none'
            txt += 'show'
        } else if (state === 1) {
            state = 0;
            display = 'block'
            txt += 'hide'
        }
        hideShow.style('display', display)
        self.attr('state', state)
        self.html(txt)
    })
    brian.on('click', function () {
        var self = d3.select(this)
        var state = +self.attr('state')
        var txt = 'Brian Dozier: '
        var hideShow = d3.selectAll('.Brian')
        var display = +hideShow.style('display')
        if (state === 0) {
            state = 1
            display = 'none'
            txt += 'show'
        } else if (state === 1) {
            state = 0;
            display = 'block'
            txt += 'hide'
        }
        hideShow.style('display', display)
        self.attr('state', state)
        self.html(txt)
    })
    eddie.on('click', function () {
        var self = d3.select(this)
        var state = +self.attr('state')
        var txt = 'Eddie Rosario: '
        var hideShow = d3.selectAll('.Eddie')
        var display = +hideShow.style('display')
        if (state === 0) {
            state = 1
            display = 'none'
            txt += 'show'
        } else if (state === 1) {
            state = 0;
            display = 'block'
            txt += 'hide'
        }
        hideShow.style('display', display)
        self.attr('state', state)
        self.html(txt)
    })
    minesota.on('click', function () {
        var self = d3.select(this)
        var state = +self.attr('state')
        var txt = 'Minesota Twins: '
        var hideShow = d3.selectAll('.Minesota')
        var display = +hideShow.style('display')
        if (state === 0) {
            state = 1
            display = 'none'
            txt += 'show'
        } else if (state === 1) {
            state = 0;
            display = 'block'
            txt += 'hide'
        }
        hideShow.style('display', display)
        self.attr('state', state)
        self.html(txt)
    })



    plot.call(chart, {
        data: data,
        axis: {
            y: yAxis,
            x: xAxis,
            gridlines: {
                y: yGridlines,
                x: xGridlines
            }
        },
        initialize: true
    })
}, 200);