export class Religion {
    constructor(population, pressureMultiplier, resistance, bonus)
    {
        this.population = population;

        this.pressureMultiplier = pressureMultiplier;
        this.resistanceMultiplier = resistance;
        this.bonus = bonus;
    }

    updateReligion(dt) 
    {
        var unconvertedPopulation = [];
        for(let i = 0; i<3; i++)
        {
            unconvertedPopulation[i] = this.population.tierPopulation[i] - this.population.convertedPopulation[i];
        }
        var pressure = []
        
        for(let i = 0; i<3; i++)
        {
            pressure[i] = Math.round(this.population.convertedPopulation[i]) * (this.pressureMultiplier[i]) * (1-this.resistanceMultiplier[i]);
        }
        
        var converts = [0,0,0];
        for(let i = 0; i<3; i++)
        {
            for(let j = 0; j< 3; j++)
            {
                converts[i] += pressure[i] * this.bonus[2-i+j];
            }
            this.population.convertedPopulation[i] += (dt/1000)*converts[i]*this.population.gameSpeed;            
        }
    }
    ChangeTiers(from, to, number)
    {
        switch(from)
        {
            case 1:
                if(this.population.convertedTierOnePopulation >= number) {
                    this.population.convertedTierOnePopulation -= number;
                }
                else {
                    return false;
                }
                break;
            case 2:
                if(this.population.convertedTierTwoPopulation >= number) {
                    this.population.convertedTierTwoPopulation -= number;
                }
                else {
                    return false;
                }
                break;
            case 3:
                if(this.convertedTierThreePopulation >= number) {
                    this.convertedTierThreePopulation -= number;
                }
                else {
                    return false;
                }
                break;
        }
        switch(to)
        {
            case 1:
                this.population.convertedTierOnePopulation += number;                
            case 2:
                this.population.convertedTierTwoPopulation += number;  
            case 3:
                this.population.convertedTierThreePopulation += number;
        }
        return true; 
    }
}