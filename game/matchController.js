import Vector from "../Utilities/vector.js";
import Utilities from '../Utilities/utilities.js';

export default class MatchController{
    static CheckMatch(mousePos ,grid ,game){
       
      const cell = grid.getNodeWithCoord(mousePos.x ,mousePos.y);
      if(cell != null && cell.holder.currentState != 0) return;

      
        let sameNeighbours ={
            list: [cell]
        } 
        MatchController.getSameNeighbours(cell ,sameNeighbours);

       if(sameNeighbours.list.length < 2){
        cell.holder.wrongMatch();
        new Promise(resolve => setTimeout(resolve, 300)).then(() => { game.currentState = 0; });

       }else{
        sameNeighbours.list.forEach(element => {
            element.holder.matched();  
        });
        new Promise(resolve => setTimeout(resolve, 500)).then(() => { this.repositionObjects(sameNeighbours.list ,grid ,game); });
       }
      
    }

    static repositionObjects(sameNeighbours ,grid ,game){

        sameNeighbours.forEach(element => {
            const type = Utilities.getRandomInt(0 ,element.holder.sprite.spriteSheet.spriteData.frames.length - 1);
            element.holder.type = type;
        });

        sameNeighbours.forEach(element => {
            const x = element.gridPos.x;
            for (let index = grid.heigth - 1; index >= 0 ; index--) {
                const element = grid.getNodeWithoutCoord(x ,index);
                if(element.holder.currentState == 1){
                    for (let index2 = index; index2 >= 0 ; index2--) {
                        const elementUp = grid.getNodeWithoutCoord(x ,index2);
                        if(elementUp.holder.currentState == 0){

                            const cell = grid.getNodeWithoutCoord(element.holder.cell.gridPos.x ,element.holder.cell.gridPos.y);
                            element.holder.cell =  elementUp.holder.cell;
                            elementUp.holder.cell =  cell;

                            const holder = element.holder;
                            element.holder =  elementUp.holder;
                            elementUp.holder =  holder;
                            
                            index = grid.heigth - 1;
                            break;
                         }
                    }                
                }
            }
        });

        for(let i = 0; i < grid.width; i++){
            for(let j = 0; j < grid.heigth; j++){

                const element = grid.getNodeWithoutCoord(i ,j).holder;
                
                element.movePosition(new Vector(element.cell.x ,element.cell.y));

            }
        }      
        new Promise(resolve => setTimeout(resolve, 500)).then(() => {
            MatchController.checkForMatchable(grid ,game);
             });

       
    }

    static getSameNeighbours(cell ,sameNeighbours){        
        const neighbours = cell.getNeighbours();

        const currentSame = [];
        for(let i = 0; i < neighbours.length; i++){
            if(neighbours[i].holder.type == cell.holder.type){
                if(!sameNeighbours.list.includes(neighbours[i]))
                currentSame.push(neighbours[i]);
            }
        }
        sameNeighbours.list = sameNeighbours.list.concat(currentSame);

        for (let index = 0; index < currentSame.length; index++) {
            const element = currentSame[index];
            (MatchController.getSameNeighbours(element ,sameNeighbours));
        }
    }
    static checkForMatchable(grid ,game){
        for(let i = 0; i < grid.width; i++){
            for(let j = 0; j < grid.heigth; j++){

                const cell = grid.getNodeWithoutCoord(i ,j);
                const neighbours = cell.getNeighbours();

                for(let i = 0; i < neighbours.length; i++){
                    if(neighbours[i].holder.type == cell.holder.type){
                        game.currentState = 0; 
                       return;
                    }
                }

            }
        }
        MatchController.shuffle(grid);    
    }
    static shuffle(grid){
        for(let i = 0; i < grid.width; i++){
            for(let j = 0; j < grid.heigth; j++){
               grid.getNodeWithoutCoord(i ,j).holder.changeType();
            }
        }
        new Promise(resolve => setTimeout(resolve, 500)).then(() => {
            MatchController.checkForMatchable(grid ,game);

             });
    }
}