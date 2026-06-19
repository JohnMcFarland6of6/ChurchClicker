import { Economy } from "./Economy.js";
import { Religion } from "./Religion.js";

export class Country {
    constructor(name, population, religion, economy)
    {
        this.name = name;
        this.population = population;
        this.religion = religion;
        this.economy = economy;
    }
}


export class Population {
    constructor(population, tierPercent)
    {
        this.population = population;
        this.tierPercent = tierPercent;
        
        this.tierPopulation = []
        for(let i = 0; i<3; i++)
        {
            this.tierPopulation[i] = tierPercent[i] * population;
        }
        this.convertedPopulation = [0,0,0];

        this.gameSpeed = 0.001;
    }
    
    
    MissionTripSent(tierOne, tierTwo, tierThree)
    {
        if(this.convertedPopulation[0] >= tierOne && this.convertedPopulation[1] >= tierTwo && this.convertedPopulation[2] >= tierThree)
        {
            this.convertedPopulation[0] -= tierOne;
            this.convertedPopulation[1] -= tierTwo;
            this.convertedPopulation[2] -= tierThree;

            this.tierPopulation[0] -= tierOne;
            this.tierPopulation[1] -= tierTwo;
            this.tierPopulation[2] -= tierThree;

            this.population -= tierOne + tierTwo + tierThree;
            return true;
        }
        else
        {
            return false;
        }
    }

    MissionTripReceived(tierOne, tierTwo, tierThree)
    {
        this.convertedPopulation[0] -= tierOne;
        this.convertedPopulation[1] -= tierTwo;
        this.convertedPopulation[2] -= tierThree;

        this.tierPopulation[0] -= tierOne;
        this.tierPopulation[1] -= tierTwo;
        this.tierPopulation[2] -= tierThree;

        this.population += tierOne + tierTwo + tierThree;
    }
    

    GrowPopulation(growthRate) //about 1.1% yearly
    {
        for(let i = 0; i<3; i++)
        {
            this.tierPopulation[i] += this.tierPopulation[i]*growthRate;
            this.convertedPopulation[i] += this.convertedPopulation[i]*growthRate;
        }

        this.population += this.population*growthRate;
    }
}
