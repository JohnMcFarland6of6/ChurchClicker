import { Economy } from "./Economy.js";
import { Religion } from "./Religion.js";
import { Country, Population } from "./Population.js";
import { Upgrade } from "./Upgrade.js";

const USER_DATA = './save/WORLD.json';
const NEW_GAME = './data/WORLD.json';

const countries = ['CANADA', 'CENTRAL_EU', 'USA'];

export async function readJSONFile(filePath)
{
    try
    {
        const resp = await fetch(filePath);
        if(!resp.ok)
        {
            return null;
        }
        const data = await resp.json();    
        return data;
    }
    catch(e)
    {
        console.error(e);
        return null;
    }
}

export async function getSaveData(fileName)
{
    let data = await readJSONFile(`./save/${fileName}.json`);
    if (data === null)
    {
        //data = await readJSONFile(NEW_GAME);
        data = await readJSONFile(`./data/${fileName}.json`);
    }
    return data;   
}

export function getCountryObject(data)
{
    let pop = new Population(data.Population.population, data.Population.tierPercentages);
    let religion = new Religion(pop, data.Religion.pressureMultipliers, data.Religion.resistanceMultipliers, data.Religion.tierBonusMultipliers);
    let economy = new Economy(pop, data.Economy.weekdayTithe, data.Economy.sundayTithe)
    let country = new Country(data.Population.name, pop, religion, economy);

    return country; 
}

export async function getWorldObjects()
{
    let data = await getSaveData("WORLD");
    let world = [];
    for(let i = 0; i<data.length; i++)
    {
        let country = getCountryObject(data[i]);
        world.push(country);
    }
    return world;
}


export async function getUpgradeTree()
{
    let data = await getSaveData("UPGRADE_TREE");
    let upgrades = new Map();

    let rootData = data[0];
    let root = new Upgrade(rootData.locked, rootData.purchased, rootData.cost, rootData.title, rootData.code, rootData.value, rootData.next);
    upgrades.set(root.title, root);

    for(let i = 1; i<data.length; i++)
    {
        let upgrade = new Upgrade(data[i].locked, data[i].purchased, data[i].cost, data[i].title, data[i].code, data[i].value, data[i].next);
        upgrades.set(upgrade.title, upgrade);
    }
    console.log(upgrades);
    connectNodes(root, upgrades);
    return root;
}

export async function connectNodes(root, nodes)
{
    let queue = []; 
    let child = null;
    for(let i = 0; i<root.next.length; i++)
    {
        child = nodes.get(root.next[i]);
        root.next[i] = child;
        child.prev.push(root);
        queue.push(child);
    }
    while(queue.length != 0)
    {
        root = queue.shift();
        for(let i = 0; i<root.next.length; i++)
        {
            child = nodes.get(root.next[i]);
            root.next[i] = child;   
            child.prev.push(root);
            queue.push(child);
        }
    }

}
