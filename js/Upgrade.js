export class Upgrade {
    constructor(locked, purchased, cost, title, code, value, next)
    {
        this.locked = locked;
        this.purchased = purchased; 
        this.cost = cost;
        this.title = title;
        this.code = code;
        this.value = value;
        this.next = next;

        this.prev = [];
    }
    setPreRecs(arr) 
    {
        for(let i = 0; i<arr.length; i++)
        {
            this.preRecss.push(arr[i]);
        }
    }
    setNext(arr)
    {
        for(let i = 0; i<arr.length; i++)
        {
            this.next.push(arr[i]);
        }
    }

    get upgradeMap()
    {

    }
}
