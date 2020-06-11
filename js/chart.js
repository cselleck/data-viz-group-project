// utility functions

const getRandomNumberInRange = (min, max) => Math.random() * (max - min) + min

const getRandomValue = arr => arr[Math.floor(getRandomNumberInRange(0, arr.length))]

const sentenceCase = str => [
    str.slice(0, 1).toUpperCase(),
    str.slice(1),
].join("")

async function drawChart() {


    // Parse Data/Cast as numbers
    const pathToJSON = "trumpTweets.csv";
    var dataset = [];
    await d3
        .csv(pathToJSON, function(d) {
            dataset.push({
                tweetType: d.is_retweet,
                tweetYear: d.Year,
                tweetHour: d.Hour
            });
        })
        .then(function(data) {
            console.log("finished");
        });

    //used to generate a random row later
    const index = dataset.length
    console.log(index)
    const usedIndex = []

    const tweets = ["True", "False"]
    const tweetTypeId = d3.range(tweets.length)

    const year = ["2017", "2018", "2019"]
    const tweetYearId = d3.range(year.length)
    const timeofDay = [
        "12 AM to 4 AM",
        "4 AM to 8 AM",
        "8 AM to 12 PM",
        "12 PM to 4 PM",
        "4 PM to 8 PM",
        "8 PM to 12 AM"
    ]
    const timeId = d3.range(timeofDay.length)
        //const getStatusKey = ({ is_retweet, Year }) => [is_retweet, Year].join("--")

    //const stackedProbabilities = {}
    //const totalHours = {}

    //dataset.forEach(startingPoint => {
    //     const key = getStatusKey(startingPoint)
    //     let stackedProbability = 0
    //     totalHours[startingPoint[Hour]] += 1
    //     stackedProbabilities[key] = timeofDay.map((Hour) => {
    //         if (Hour == "12 AM to 4 AM") {
    //             return .1
    //         } else if (Hour == "4 AM to 8 AM") {
    //             return .25
    //         } else if (Hour == "8 AM to 12 PM") {
    //             return .45
    //         } else if (Hour == "12 PM to 4 PM") {
    //             return .60
    //         } else if (Hour == "4 PM to 8 PM") {
    //             return .80
    //         } else {
    //             return .90
    //         }

    //     })
    // })


    // const tweetYear = d => d3.time.format("%Y").parse(d.created_at)
    // const yearNames = ["2017", "2018", "2019"]
    // const tweetYearId = d3.range(yearNames.length)

    // const getStatusKey = ({ tweetTypes, twtYear }) => [tweetTypes, twtYear].join("--")

    let currentTweet = 0

    function generateTweet(elapsed) {
        currentTweet++
        // Use our utility functions (bottom) to select a random value from our arrays

        //finds a random index that has not been used before
        for (i = 0; i < index; i++) {
            const randomRow = getRandomValue(index)
            if (randomRow.inArray(randomRow, usedIndex) == -1) {
                continue;
            }
        }
        const tweetTypes = dataset[randomRow].tweetType

        const twtYear = dataset[randomRow].tweetYear
        const twtHour = dataset[randomRow].tweetHour

        console.log(twtYear)
        console.log(tweetTypes)
        console.log(twtHour)
            //add randomRow to the used index to exclude using it again
        usedIndex.append(randomRow)
        return {
            id: currentTweet,
            tweetTypes,
            twtYear,
            twtHour,
            startTime: elapsed + getRandomNumberInRange(-0.1, 0.1),
            yJitter: getRandomNumberInRange(-15, 15),
        }

    }
    // 2. Create chart dimensions

    const width = d3.min([
        window.innerWidth * 0.9,
        1200
    ])
    let dimensions = {
        width: width,
        height: 500,
        margin: {
            top: 10,
            right: 200,
            bottom: 10,
            left: 120,
        },
        pathHeight: 50,
        endsBarWidth: 15,
        endingBarPadding: 3,
    }
    dimensions.boundedWidth = dimensions.width -
        dimensions.margin.left -
        dimensions.margin.right
    dimensions.boundedHeight = dimensions.height -
        dimensions.margin.top -
        dimensions.margin.bottom

    // 3. Draw canvas

    const wrapper = d3.select("#wrapper")
        .append("svg")
        .attr("width", dimensions.width)
        .attr("height", dimensions.height)

    const bounds = wrapper.append("g")
        .style("transform", `translate(${
      dimensions.margin.left
      }px, ${
      dimensions.margin.top
      }px)`)

    // 4. Create scales

    // We have three starting y positions and six ending y positions to draw paths for
    const xScale = d3.scaleLinear()
        .domain([0, 1])
        .range([0, dimensions.boundedWidth]) // 0 is waiting start; 1 means the journey to the right is complete
        .clamp(true) // Clamp our data so that we are not drawing outside our path

    const startYScale = d3.scaleLinear()
        .domain([tweetYearId.length, -1])
        .range([0, dimensions.boundedHeight])

    const endYScale = d3.scaleLinear()
        .domain([timeofDay.length, -1])
        .range([0, dimensions.boundedHeight])

    const yTransitionProgressScale = d3.scaleLinear()
        .domain([0.45, 0.55]) // x progress
        .range([0, 1]) // y progress
        .clamp(true)

    const colorScale = d3.scaleLinear()
        .domain(d3.extent(tweetYearId))
        .range(["#12CBC4", "#B53471"])
        .interpolate(d3.interpolateHcl)

    // 5. Draw data
    const linkLineGenerator = d3.line()
        .x((d, i) => i * (dimensions.boundedWidth / 5))
        .y((d, i) => i <= 2 ?
            startYScale(d[0]) :
            endYScale(d[1])
        )
        .curve(d3.curveMonotoneX)
    const linkOptions = d3.merge(
        tweetYearId.map(startId => (
            timeofDay.map(endId => (
                new Array(6).fill([startId, endId])
            ))
        ))
    )
    const linksGroup = bounds.append("g")
    const links = linksGroup.selectAll(".category-path")
        .data(linkOptions)
        .enter().append("path")
        .attr("class", "category-path")
        .attr("d", linkLineGenerator)
        .attr("stroke-width", dimensions.pathHeight)

    // 6. Draw peripherals

    const startingLabelsGroup = bounds.append("g")
        .style("transform", "translateX(-20px)")

    const startingLabels = startingLabelsGroup.selectAll(".start-label")
        .data(tweetYearId)
        .enter().append("text")
        .attr("class", "label start-label")
        .attr("y", (d, i) => startYScale(i))
        .text((d, i) => sentenceCase(year[i]))

    const startLabel = startingLabelsGroup.append("text")
        .attr("class", "start-title")
        .attr("y", startYScale(tweetYearId[tweetYearId.length - 1]) - 65)
        .text("Tweets by Year")
    const startLabelLineTwo = startingLabelsGroup.append("text")
        .attr("class", "start-title")
        .attr("y", startYScale(tweetYearId[tweetYearId.length - 1]) - 50)
        .text("2017-2019")

    const startingBars = startingLabelsGroup.selectAll(".start-bar")
        .data(tweetYearId)
        .enter().append("rect")
        .attr("x", 20)
        .attr("y", d => startYScale(d) - (dimensions.pathHeight / 2))
        .attr("width", dimensions.endsBarWidth)
        .attr("height", dimensions.pathHeight)
        .attr("fill", colorScale)

    const endingLabelsGroup = bounds.append("g")
        .style("transform", `translateX(${
      dimensions.boundedWidth + 20
      }px)`)

    const endingLabels = endingLabelsGroup.selectAll(".end-label")
        .data(timeofDay)
        .enter().append("text")
        .attr("class", "label end-label")
        .attr("y", (d, i) => endYScale(i) - 15)
        .text(d => d)

    // Represent tweets on the chart using circles
    const maleMarkers = endingLabelsGroup.selectAll(".male-marker")
        .data(timeofDay)
        .enter().append("circle")
        .attr("class", "ending-marker male-marker")
        .attr("r", 5.5)
        .attr("cx", 5)
        .attr("cy", d => endYScale(d) + 5)

    // Represent retweets on the chart using triangles
    const trianglePoints = [ // [0,0] is the starting point
        "-7,  6",
        " 0, -6",
        " 7,  6",
    ].join(" ")
    const femaleMarkers = endingLabelsGroup.selectAll(".female-marker")
        .data(timeofDay)
        .enter().append("polygon")
        .attr("class", "ending-marker female-marker")
        .attr("points", trianglePoints)
        .attr("transform", d => `translate(5, ${endYScale(d) + 20})`)

    // Create our legend container
    const legendGroup = bounds.append("g")
        .attr("class", "legend")
        .attr("transform", `translate(${dimensions.boundedWidth}, 5)`)

    const femaleLegend = legendGroup.append("g")
        .attr("transform", `translate(${
      - dimensions.endsBarWidth * 1.5
      + dimensions.endingBarPadding
      + 1
      }, 0)`)
    femaleLegend.append("polygon")
        .attr("points", trianglePoints)
        .attr("transform", "translate(-7, 0)")
    femaleLegend.append("text")
        .attr("class", "legend-text-left")
        .text("Retweet")
        .attr("x", -20)
    femaleLegend.append("line")
        .attr("class", "legend-line")
        .attr("x1", -dimensions.endsBarWidth / 2 + 1)
        .attr("x2", -dimensions.endsBarWidth / 2 + 1)
        .attr("y1", 12)
        .attr("y2", 37)

    const maleLegend = legendGroup.append("g")
        .attr("transform", `translate(${
      - dimensions.endsBarWidth / 2
      - 4
      }, 0)`)
    maleLegend.append("circle")
        .attr("r", 5.5)
        .attr("transform", "translate(5, 0)")
    maleLegend.append("text")
        .attr("class", "legend-text-right")
        .text("Tweet")
        .attr("x", 15)
    maleLegend.append("line")
        .attr("class", "legend-line")
        .attr("x1", dimensions.endsBarWidth / 2 - 3)
        .attr("x2", dimensions.endsBarWidth / 2 - 3)
        .attr("y1", 12)
        .attr("y2", 37)

    // 7. Set up interactions

    const maximumPeople = index
    let people = []
    const markersGroup = bounds.append("g")
        .attr("class", "markers-group")
    const endingBarGroup = bounds.append("g")
        .attr("transform", `translate(${dimensions.boundedWidth}, 0)`)

    function updateMarkers(elapsed) {
        // Animate progress along the path over a 5 s time period
        const xProgressAccessor = d => (elapsed - d.startTime) / 5000
        if (people.length < maximumPeople) {
            people = [
                ...people,
                ...d3.range(2).map(() => generateTweet(elapsed)),
            ]
        }

        // retweets
        const retweets = markersGroup.selectAll(".marker-circle")
            .data(people.filter(d => (
                xProgressAccessor(d) < 1 &&
                tweetType(d) == "True"
            )), d => d.id)
        retweets.enter().append("circle")
            .attr("class", "marker marker-circle")
            .attr("r", 5.5)
            .style("opacity", 0)
        retweets.exit().remove()

        // tweets
        const tweets = markersGroup.selectAll(".marker-triangle")
            .data(people.filter(d => (
                xProgressAccessor(d) < 1 &&
                tweetType(d) == "False"
            )), d => d.id_str)
        tweets.enter().append("polygon")
            .attr("class", "marker marker-triangle")
            .attr("points", trianglePoints)
            .style("opacity", 0)
        tweets.exit().remove()

        const markers = d3.selectAll(".marker")

        // Move our markers
        markers.style("transform", d => {
                const x = xScale(xProgressAccessor(d))
                const yStart = startYScale(tweetYear(d))
                const yEnd = endYScale(tweetHour(d))
                const yChange = yEnd - yStart
                const yProgress = yTransitionProgressScale(
                    xProgressAccessor(d)
                )
                const y = yStart +
                    (yChange * yProgress) +
                    d.yJitter
                return `translate(${x}px, ${y}px)`
            })
            .attr("fill", d => colorScale(tweetYear(d)))
            .transition().duration(100)
            .style("opacity", d => xScale(xProgressAccessor(d)) < 10 ?
                0 :
                1
            )

        // Where did people end up?
        const endingGroups = timeId.map(endId => (
            people.filter(d => (
                xProgressAccessor(d) >= 1 &&
                timeId(d) == endId
            ))
        ))
        const endingPercentages = d3.merge(
            endingGroups.map((peopleWithSameEnding, endingId) => (
                d3.merge(
                    tweetTypeId.map(tweetType => (
                        tweetYearId.map(tweetYear => {
                            const peopleInBar = peopleWithSameEnding.filter(d => (
                                tweetType(d) == tweetTypeId
                            ))
                            const countInBar = peopleInBar.length
                            const peopleInBarWithSameStart = peopleInBar.filter(d => (
                                tweetYear(d) == tweetYearId
                            ))
                            const count = peopleInBarWithSameStart.length
                            const numberOfPeopleAbove = peopleInBar.filter(d => (
                                tweetYear(d) > tweetYearId
                            )).length

                            return {
                                endingId,
                                tweetYearId,
                                tweetTypeId,
                                count,
                                countInBar,
                                percentAbove: numberOfPeopleAbove / (peopleInBar.length || 1),
                                percent: count / (countInBar || 1),
                            }
                        })
                    ))
                )
            ))
        )

        // Draw our ending bars
        endingBarGroup.selectAll(".ending-bar")
            .data(endingPercentages)
            .join("rect")
            .attr("class", "ending-bar")
            .attr("x", d => -dimensions.endsBarWidth * (d.tweetTypeId + 1) -
                (d.tweetTypeId * dimensions.endingBarPadding)
            )
            .attr("width", dimensions.endsBarWidth)
            .attr("y", d => endYScale(d.endingId) -
                dimensions.pathHeight / 2 +
                dimensions.pathHeight * d.percentAbove
            )
            .attr("height", d => d.countInBar ?
                dimensions.pathHeight * d.percent :
                dimensions.pathHeight
            )
            .attr("fill", d => d.countInBar ?
                colorScale(d.tweetYearId) :
                "#dadadd"
            )

        // Draw ending values
        endingLabelsGroup.selectAll(".ending-value")
            .data(endingPercentages)
            .join("text")
            .attr("class", "ending-value")
            .attr("x", d => (d.tweetYearId) * 33 +
                47
            )
            .attr("y", d => endYScale(d.endingId) -
                dimensions.pathHeight / 2 +
                14 * d.tweetTypeId +
                35
            )
            .attr("fill", d => d.countInBar ?
                colorScale(d.tweetYearId) :
                "#dadadd"
            )
            .text(d => d.count)
    }
    d3.timer(updateMarkers)
}
drawChart()