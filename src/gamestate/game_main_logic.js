
// 1) Se hace un base game con un input que des una ficha en estilo "[#,#]" se coloca en un tablero que es una matrix X*X . Si no hay ninguna ficha se coloca en la matriz se coloca una ficha en el centro del juego.
// 2) La ficha del input va a buscar una ficha que tengo algun lado disponible y se coloca al lado. (Hay que asegurarse que la ficha donde se coloque sea el lugar adecuado)
// 3) Se crea un set de fichas del que puedas pick up alguna ficha random.
// 4) Se setea que al comenzar el jugador reciba 7 fichas de domino de ese set. y el jugador solo pueda input esas fichas. 
// 5) Si el jugador no tiene fichas, el jugador gana.

// let path_matrix = [
// [1,1,1,1,1,1,1,1,1,],
// [0,0,0,0,0,0,0,0,1,],
// [0,0,0,0,0,0,0,0,1,],
// [1,1,1,1,1,1,1,1,1,],
// [1,0,0,0,0,0,0,0,0,],
// [1,0,0,0,0,0,0,0,0,],
// [1,1,1,1,1,1,1,1,1,],
// ]


const DisplayDirection = Object.freeze({
    HORIZONTAL: 0,
    VERTICAL: 1,
});

const Position = Object.freeze({
    LEFT: -1,
    RIGHT: 1,
});

class Domino {
    #values = [];
    #free_corners = [];
    #coords = [];
    #display_direction = null;
    constructor(values, coords, display_direction){
        this.#values = values;
        this.#free_corners = [...values]
        this.#coords = coords;
        this.#display_direction = display_direction
    }

    // Getters
    get values(){return this.#values}
    get freeCorners(){return this.#free_corners}
    get coords(){return this.#coords}
    get displayDirection(){return this.#display_direction}

    // Setters
    set coords(input){this.#coords = input}
    set displayDirection(input){this.#display_direction = input}

    // Methods
    removeCorner(number){
        const indexFinder = this.#free_corners.indexOf(number)
        if(indexFinder != -1){
            this.#free_corners.splice(indexFinder,1)
        }
    }
}

class Table{
    path_matrix = []
    data_matrix = []
    chips = []
    chips_on_table = 0
    right_domino = null;
    left_domino = null;
    constructor(path_matrix, chips){
        this.path_matrix = path_matrix
        this.chips = chips
        this.data_matrix = this.createDominoesDataMatrix()
    }

    createDominoesDataMatrix(){
        let n = this.path_matrix.length
        let m = this.path_matrix[0].length

        let new_data_matrix = []
        for(let i = 0; i < n; i++){
            let data_row = []
            for(let j = 0; j < m; j++){
                data_row.push(null)
            }
            new_data_matrix.push(data_row)
        }
        return new_data_matrix
    }

    findNewCoordinates(coords){
        let list = [[0,1],[0,-1],[1,0],[-1,0]]
        for(let i = 0; i < list.length; i++){
            let x = list[i][1]
            let y = list[i][0]
    
            let curr_x = coords[1]
            let curr_y = coords[0]
        
            if(x+curr_x < 0 || x+curr_x > this.path_matrix[0].length){
                continue;
            }else if(y+curr_y < 0 || y+curr_y > this.path_matrix.length){
                continue;
            }
        
            if(this.path_matrix[y+curr_y][x+curr_x] == 1){
                this.path_matrix[y+curr_y][x+curr_x] = -1
                return [y+curr_y,x+curr_x]
            }
        }
        return []
    }

    playerChips(){
        let player_chips = []
        for(let i = 0; i < 7; i++){
            let random_ficha = Math.floor(Math.random() * this.chips.length-1)
            player_chips.push(this.chips[random_ficha])
            this.chips.splice(random_ficha,1)
        }
        return player_chips
    }

    placeDomino(domino_to_place, position){
        if (this.chips_on_table == 0){
            let current_domino = new Domino(domino_to_place,[2,2],
                                DisplayDirection.HORIZONTAL)
            this.left_domino = current_domino
            this.right_domino = current_domino
                
            let center_y = Math.floor(this.path_matrix.length/2)
            let center_x = Math.floor(this.path_matrix[0].length/2)
            this.data_matrix[center_y][center_x] = current_domino
            this.path_matrix[center_y][center_x] = -1
        }else{
            let adjacent_domino;
            if(position == Position.LEFT){
                adjacent_domino = this.left_domino
            }else{
                adjacent_domino = this.right_domino
            }
    
            let is_legal = true
            let number_to_place;
            if(adjacent_domino.freeCorners.includes(domino_to_place[0])){
                number_to_place = domino_to_place[0]
            }else if(adjacent_domino.freeCorners.includes(domino_to_place[1])){
                number_to_place = domino_to_place[1]
            }else{
                is_legal = false
            }
    
            if(is_legal){
                let new_coords = this.findNewCoordinates(adjacent_domino.coords)
                let current_domino = new Domino(domino_to_place, 
                                    new_coords,
                                    DisplayDirection.HORIZONTAL)
                adjacent_domino.removeCorner(number_to_place)
                current_domino.removeCorner(number_to_place)
                    
                if(position == Position.LEFT){
                    this.left_domino = current_domino
                }else if (position == Position.RIGHT){
                    this.right_domino = current_domino
                }
                this.data_matrix[new_coords[0]][new_coords[1]] = current_domino
            }
        }
        this.chips_on_table++;
    }

    drawMatrix(){
        let matrix = []
        for(let i = 0; i < this.data_matrix.length; i++){
            let sub_list = []
            for(let j = 0; j < this.data_matrix[i].length; j++){
                if(this.data_matrix[i][j] != null){
                    sub_list.push((this.data_matrix[i][j].values[0]).toString()+"|"+(this.data_matrix[i][j].values[1]).toString())
                }else{
                    sub_list.push("X")
                }
            }
            matrix.push(sub_list)
        }
        return matrix
    }
}


function main(){
    const fichas = [[0,0],[0,1],[0,2],[0,3],[0,4],[0,5],[0,6],
                    [1,1],[1,2],[1,3],[1,4],[1,5],[1,6],[2,2],
                    [2,3],[2,4],[2,5],[2,6],[3,3],[3,4],[3,5],
                    [3,6],[4,4],[4,5],[4,6],[5,5],[5,6],[6,6]]
    const global_path_matrix = [
    [1,1,1,1,1],
    [0,0,0,0,1],
    [1,1,1,1,1],
    [1,0,0,0,0],
    [1,1,1,1,1],
    ]

    let table = new Table(global_path_matrix,fichas)



    console.log(table.drawMatrix())
}


main()