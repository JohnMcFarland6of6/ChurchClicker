
import { Economy } from "./Economy.js";
import { Religion } from "./Religion.js";
import { Country, Population } from "./Population.js";
import { getUpgradeTree, getSaveData, getWorldObjects } from "./JSONLoader.js";
import { Clicker } from "./Clicker.js";

const MAX_FPS = 30;
const FRAME_INTERVAL = 1000/MAX_FPS;
let previousTime;

//======================= Elements =======================
const convertButton = document.getElementById("convertButton");
const convertCount = document.getElementById("convertCount");
const mapButton = document.getElementById("MapButton");
const buildingsButton = document.getElementById("BuildingsButton");
const upgradesButton = document.getElementById("UpgradesButton");
const statisticsButton = document.getElementById("StatisticsButtonButton");

convertButton.style.setProperty('--animation-duration', `${5}s`);
let convertLength = 5000;


let clicker = new Clicker();
holdButton(convertButton, clicker.clickTime, convertButtonPressed);

let world = await getWorldObjects();
//console.log(world);

let root = await getUpgradeTree();
console.log(root.next[1].title);
function main()
{
    requestAnimationFrame(update);
}

function update(currentTime)
{
    
    if(previousTime === undefined)
    {
        previousTime = currentTime;
    }
    const deltaTime = currentTime - previousTime;
    if(deltaTime >= FRAME_INTERVAL)
    {
        previousTime = currentTime - (deltaTime % FRAME_INTERVAL);
        

        //update whatever
        world[2].religion.updateReligion(FRAME_INTERVAL);
        convertCount.textContent = "Population: "+Math.round(world[2].population.convertedPopulation[0]);
    }
    //update animations
    requestAnimationFrame(update);
}


//==================== Button Listeners ========================

function holdButton(btn, duration, func)
{
    let timer = null;
    btn.addEventListener('mousedown', () => 
    {
        btn.classList.add('animating');
        timer = setTimeout(() => 
        {
            timer = null;
            btn.classList.remove('animating');
            func();
        }, convertLength);
    });

    btn.addEventListener('mouseup', () => {
        if(!timer) 
        {
            return;
        }
        clearTimeout(timer);
        timer = null;
        btn.classList.remove('animating');
    });   
}
mapButton.addEventListener('mousedown', () => 
    {   
        clicker.updateBase(2);
    });
function convertButtonPressed()
{
    world[2].population.convertedPopulation[0]+= clicker.clickPower(); 
    //convertCount.textContent = "Population: "+NAcountry.population.convertedPopulation[0];
    
}

main();
