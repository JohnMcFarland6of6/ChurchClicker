var xArr = [];
var yArr = [];
var total = 0;

function plot()
{
    for(let i = total; i<total+100; i++)
    {
        xArr.push(i);
        yArr.push(NAcountry.population.convertedTierOnePopulation);
        NAcountry.religion.updateReligion();
        console.log("------------------------------------------");
        console.log(i);
        console.log("Tier One: "+NAcountry.population.convertedTierOnePopulation);
        console.log("Tier Two: "+NAcountry.population.convertedTierTwoPopulation);
        console.log("Tier Three: "+NAcountry.population.convertedTierThreePopulation);
    }
    total += 100;
      // Define Data
    const data = [{
        x: xArr,
        y: yArr,
        mode: "markers + line"
    }];

    // Define Layout
    const layout = {
        xaxis: {title: "X-Axis" },
        yaxis: { title: "Y-Axis" },
        title: "Seconds vs Converts"
    };

    // Display using Plotly
    Plotly.newPlot("myPop", data, layout);
}
