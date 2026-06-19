export class Clicker 
{
    constructor() 
    {
        this.clickTime = 5000;
        this.clickBase = 1;
        this.clickMultiplier = 1;

    }   
    clickPower()
    {
        return this.clickBase*this.clickMultiplier;
    }
    updateBase(bonus)
    {
        this.clickBase += bonus;
    }
    updateMultiplier(mult)
    {
        this.clickMultiplier *= mult;
    }
}