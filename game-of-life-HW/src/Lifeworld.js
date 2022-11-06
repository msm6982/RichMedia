// model class Lifeworld
// TODO: Write code
class Lifeworld{
    constructor(numCols=60,numRows=40,percentAlive=.1){
        this.numCols = numCols;
        this.numRows = numRows;
        this.percentAlive = percentAlive;
        this.world = this.buildArray();
        this.worldBuffer = this.buildArray();
        this.randomSetup();
        console.table(this.world);
    }

    buildArray(){
        let gird = [];
        for (let col = 0; col < this.numCols; col++){
            let newColumn = new Array(this.numRows).fill(0);
            gird.push(newColumn);
        }
        return gird;
    }

    randomSetup(){
        for (let col = 0; col < this.numCols; col++) {
            for (let row = 0; row < this.numRows; row++) {
                this.world[col][row] = Math.random() < this.percentAlive ? 1 : 0; 
            }
        }
    }

    getLivingNeighbors(x,y){
        let arr = this.world; // create an alias so we get to type less below
        if(x > 0 && y > 0 && x < this.numCols-1 && y < this.numRows-1) {
                let totalAlive = 
                    arr[x-1][y-1]+ // Northwest
                    arr[x][y-1]+   // North
                    arr[x+1][y-1]+ // Northeast
                    arr[x-1][y]+   // West
                    arr[x+1][y]+   // East
                    arr[x-1][y+1]+ // Southwest
                    arr[x][y+1]+   // South
                    arr[x+1][y+1]; // Southeast
            return totalAlive;
        } else {
            return 0;
        }
    }

    step(){
        for (let x = 0; x < this.numCols; x++) {
            for (let y = 0; y < this.numRows; y++) {
                let alive = this.getLivingNeighbors(x,y);
                let cell = this.world[x][y];

                this.worldBuffer[x][y] = 0;
                if(cell == 1) {
                    if(alive == 2 || alive === 3){
                        this.worldBuffer[x][y] = 1;
                    } 
                } else if (cell == 0 && alive == 3) {
                    this.worldBuffer[x][y] = 1;
                }
            }
            
        }

        // swap arrays
        let temp = this.world;
        this.world = this.worldBuffer;
        this.worldBuffer = temp;
    }
}