export default class Cell{
    constructor(grid ,x ,y ,gridPos ,holder){
        this.grid = grid;
        this.x = x;
        this.y = y;
        this.gridPos = gridPos;
        this.holder = holder;
    }

    getNeighbours(){
        let list = [];
        if (this.gridPos.x - 1 >= 0)
        {
            //Left
            list.push(this.grid.getNodeWithoutCoord((this.gridPos.x - 1), this.gridPos.y));
        }
        
        if (this.gridPos.x + 1 < this.grid.width)
        {
            //Right
            list.push(this.grid.getNodeWithoutCoord((this.gridPos.x + 1), this.gridPos.y));
        }
        //Down
        if (this.gridPos.y - 1 >= 0)
        {
            list.push(this.grid.getNodeWithoutCoord(this.gridPos.x, this.gridPos.y - 1));
        }
        //Up
        if (this.gridPos.y + 1 < this.grid.heigth)
        {
            list.push(this.grid.getNodeWithoutCoord(this.gridPos.x, this.gridPos.y + 1));
        }
        return list;
    }
}