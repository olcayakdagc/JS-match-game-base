import Vector from '../Utilities/vector.js';
import Cell from './cell.js';

export default class Grid{
    constructor(width ,heigth ,x ,y ,cellSize ,offset) {
        this.width = width;
        this.heigth = heigth;
        this.x = x;
        this.y = y;
        this.cellSize = cellSize;
        this.cells = [];
        this.offset = offset;
        for(let i = 0; i < width; i++){
            this.cells.push([]);
            for(let j = 0; j < heigth; j++){
                const posX = x + (cellSize.x * i); 
                const posY = y + (cellSize.y * j); 
                const gridPos = new Vector(i ,j);
                const cell = new Cell(this ,posX, posY ,gridPos ,null);
                this.cells[i].push(cell);
            }
        }
       
    }
    getNodeWithCoord(x, y)
    {
        x += this.offset.x;
        y += this.offset.y;

        const _originPos = new Vector(this.x ,this.y);
        const _x = parseInt((x - _originPos.x) /  this.cellSize.x) ;
        
        const _y = parseInt((y - _originPos.y) /  this.cellSize.y) ;
        
       

        if (_x >= 0 && _y >= 0 && _x < this.width && _y < this.heigth)
        {
            return this.cells[_x][_y];
        }
        else
        {
            return null;
        }
    }
    getNodeWithoutCoord(x ,y){
        return this.cells[x][y];
    }
}