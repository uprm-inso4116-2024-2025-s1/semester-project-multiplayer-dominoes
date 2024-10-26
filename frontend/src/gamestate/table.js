const DisplayDirection = Object.freeze({
    HORIZONTAL: 0,
    VERTICAL: 1,
});

const Corner = Object.freeze({
    LEFT: -1,
    RIGHT: 1,
});

class Domino {
    #coords = [];
    #display_direction = null;
    #free_corners = [];
    #values = [];
    constructor(values, coords, display_direction){
        this.#values = values;
        this.#free_corners = [...values];
        this.#coords = coords;
        this.#display_direction = display_direction;
    }

    // Getters
    get coords(){return this.#coords}
    get displayDirection(){return this.#display_direction}
    get freeCorners(){return this.#free_corners}
    get values(){return this.#values}

    // Setters
    set coords(input){this.#coords = input}
    set displayDirection(input){this.#display_direction = input}

    // Methods
    removeCorner(number){
        const indexFinder = this.#free_corners.indexOf(number);
        if(indexFinder !== -1){
            this.#free_corners.splice(indexFinder,1);
        }
    }
}

// Table Class
// Constructor:
// path_matrix: A predefined matrix that shows the path the dominoes will follow, using 1 for the traversable path and 0 for the inaccessible path.
//              Example: [
//                       [1,1,1,1,1],
//                       [0,0,0,0,1],
//                       [1,1,1,1,1],
//                       [1,0,0,0,0],
//                       [1,1,1,1,1],
//                       ]
// dominoes: The list of dominoes that the game can have. By default, these are the 28 dominoes from the original game.  
//        Example: [[0,0],[0,1],[0,2],[0,3],[0,4],[0,5],[0,6]...]
class Table{
    #dominoes = [
        [0,0],[0,1],[0,2],[0,3],[0,4],[0,5],[0,6],
        [1,1],[1,2],[1,3],[1,4],[1,5],[1,6],[2,2],
        [2,3],[2,4],[2,5],[2,6],[3,3],[3,4],[3,5],
        [3,6],[4,4],[4,5],[4,6],[5,5],[5,6],[6,6]
    ];
    #played_dominoes = [];
    #dominoes_on_table = 0;
    #data_matrix = [];
    #path_matrix = [];
    #right_domino = null;
    #left_domino = null;
    #dominoes_available = this.#dominoes.length;
    constructor(path_matrix, dominoes){
        this.#path_matrix = path_matrix;
        this.#data_matrix = this.#createDominoesDataMatrix();
        if(dominoes) {
            this.#dominoes = dominoes;
            this.#dominoes_available = dominoes.length;
        };
    }

    // Getters
    // Returns the dominoes that are at each corner.
    get leftTail(){return this.#left_domino}
    get rightTail(){return this.#right_domino}
    get playedDominoes(){return this.#played_dominoes}
    get availableDominos(){return this.#dominoes_available}
    get dominoesMatrix(){return this.#data_matrix}
    get dominoesOnTable(){return this.#dominoes_on_table}

    // Private Methods
    #createDominoesDataMatrix(){
        let n = this.#path_matrix.length;
        let m = this.#path_matrix[0].length;

        let new_data_matrix = [];
        for(let i = 0; i < n; i++){
            let data_row = [];
            for(let j = 0; j < m; j++){
                data_row.push(null);
            }
            new_data_matrix.push(data_row);
        }
        return new_data_matrix;
    }
    
    #findNewCoordinates(coords, corner){
        let list = [[0,corner],[0,1],[0,-1],[1,0],[-1,0]];
        for(let i = 0; i < list.length; i++){
            let x = list[i][1];
            let y = list[i][0];
    
            let curr_x = coords[1];
            let curr_y = coords[0];
        
            if(x+curr_x < 0 || x+curr_x > this.#path_matrix[0].length){
                continue;
            }else if(y+curr_y < 0 || y+curr_y > this.#path_matrix.length){
                continue;
            }
        
            if(this.#path_matrix[y+curr_y][x+curr_x] === 1){
                this.#path_matrix[y+curr_y][x+curr_x] = -1;
                return [y+curr_y,x+curr_x];
            }
        }
        return [];
    }

    // Public Methods

    // Returns a list of 7 random dominoes.
    playerChips(){
        let player_dominoes = [];
        for(let i = 0; i < 7; i++){
            player_dominoes.push(this.grabRandomChip());
        }
        return player_dominoes;
    }

    grabRandomChip(){
        let random_index = Math.floor(Math.random() * this.#dominoes.length);
        let random_domino = this.#dominoes[random_index];
        this.#dominoes.splice(random_index,1);
        this.#dominoes_available -= 1;
        return random_domino;
    }

    calculateOpenEnds() {
        if (!this.leftTail && !this.rightTail) {
            return 0; // No dominoes placed, return 0
        }
    
        const leftEnd = this.leftTail ? (this.leftTail.freeCorners[0] || 0) : 0;
        const rightEnd = this.rightTail ? (this.rightTail.freeCorners[0] || 0) : 0;

        // Check if only one domino is placed (leftTail and rightTail are the same)
        if (this.leftTail === this.rightTail) {
            return this.leftTail.values[0] + this.leftTail.values[1];
        }
    
        // Return the sum of open ends
        return leftEnd + rightEnd;
    }

    // placeDomino places the given domino in the correct spot on the matrix and updates the state.
    // If the domino is not playable, it will be ignored and no action will be taken.
    // Inputs: 
    // domino_to_place: A domino represented as a list of two elements. 
    //                  Examples: [6, 3], [1, 2], [0, 0].
    // corner: The end where the domino will be placed, which can be either left or right. 
    //         This argument is of type Corner (Corner.LEFT or Corner.RIGHT).
    placeDomino(domino_to_place, corner){
        let is_legal = true;
        if (this.#dominoes_on_table === 0){
            let center_y = Math.floor(this.#path_matrix.length/2);
            let center_x = Math.floor(this.#path_matrix[0].length/2);

            let current_domino = new Domino(domino_to_place,[center_y,center_x],
                                DisplayDirection.HORIZONTAL);
            this.#left_domino = current_domino;
            this.#right_domino = current_domino;
                
            this.#data_matrix[center_y][center_x] = current_domino;
            this.#path_matrix[center_y][center_x] = -1;
        }else{
            let adjacent_domino;
            if(corner === Corner.LEFT){
                adjacent_domino = this.#left_domino;
            }else{
                adjacent_domino = this.#right_domino;
            }

            let number_to_place;
            if(adjacent_domino.freeCorners.includes(domino_to_place[0])){
                number_to_place = domino_to_place[0];
            }else if(adjacent_domino.freeCorners.includes(domino_to_place[1])){
                number_to_place = domino_to_place[1];
            }else{
                is_legal = false;
            }
    
            if(is_legal){
                let new_coords = this.#findNewCoordinates(adjacent_domino.coords, corner)

                if(new_coords.length > 0){
                    let display_direction  = DisplayDirection.HORIZONTAL;
                    if(new_coords[0] - adjacent_domino[0] !== 0){
                        display_direction = DisplayDirection.VERTICAL;
                    }
                    let current_domino = new Domino(domino_to_place, 
                                        new_coords,
                                        display_direction);
                    adjacent_domino.removeCorner(number_to_place);
                    current_domino.removeCorner(number_to_place);
                        
                    if(corner === Corner.LEFT){
                        this.#left_domino = current_domino;
                    }else if (corner === Corner.RIGHT){
                        this.#right_domino = current_domino;
                    }
                    this.#data_matrix[new_coords[0]][new_coords[1]] = current_domino;

                }
            }
        }
        this.#dominoes_on_table++;
        return is_legal;
    }

    // Returns a string that represents the table with dominoes in a readable format.
    // This function is useful for viewing the state of the matrix in a terminal in a more understandable way.
    drawTable(){
        let matrix = "";
        for(let i = 0; i < this.#data_matrix.length; i++){
            let sub_list = "";
            for(let j = 0; j < this.#data_matrix[i].length; j++){
                if(this.#data_matrix[i][j]){
                    sub_list += (" |"+ this.#data_matrix[i][j].values[0]).toString()+"|"+
                                  (this.#data_matrix[i][j].values[1]).toString() + "| ";
                }else{
                    sub_list += " === ";
                }
            }
            matrix += "\n"+sub_list;
        }
        return matrix;
    }
}

export {Table, Domino, Corner}