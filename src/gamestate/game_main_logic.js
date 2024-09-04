
// 1) Se hace un base game con un input que des una ficha en estilo "[#,#]" se coloca en un tablero que es una matrix X*X . Si no hay ninguna ficha se coloca en la matriz se coloca una ficha en el centro del juego.
// 2) La ficha del input va a buscar una ficha que tengo algun lado disponible y se coloca al lado. (Hay que asegurarse que la ficha donde se coloque sea el lugar adecuado)
// 3) Se crea un set de fichas del que puedas pick up alguna ficha random.
// 4) Se setea que al comenzar el jugador reciba 7 fichas de domino de ese set. y el jugador solo pueda input esas fichas. 
// 5) Si el jugador no tiene fichas, el jugador gana.
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

// const instance = new Domino([2,3],[0,2],DisplayDirection.HORIZONTAL);
// instance.removeCorner(2)

// console.log(instance.values)
// console.log(instance.freeCorners)
// console.log(instance.coords)
// console.log(instance.displayDirection)


function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

function createDominoesMatrix(n){
    let visual_matrix = []
    let data_matrix = []
    for(let i = 0; i < n; i++){
        let visual_row = []
        let data_row = []
        for(let j = 0; j < n; j++){
            visual_row.push([-1,-1])
            data_row.push(null)
        }
        visual_matrix.push(visual_row)
        data_matrix.push(data_row)
    }
    return {
        visual : visual_matrix,
        data : data_matrix,
    }
}

function player_fichas(fichas){
    // Player escoge cantidad de fichas
    let player_fichas = []
    for(let i = 0; i < 7; i++){
        let random_ficha = getRandomInt(fichas.length-1)
        player_fichas.push(fichas[random_ficha])
        fichas.splice(random_ficha,1)
    }
    return player_fichas
}

let right_domino;
let left_domino;

let visual_matrix
let data_matrix;

let fichas_placed = 0

function main(){

    const fichas = [[0,0],[0,1],[0,2],[0,3],[0,4],[0,5],[0,6],
                    [1,1],[1,2],[1,3],[1,4],[1,5],[1,6],[2,2],
                    [2,3],[2,4],[2,5],[2,6],[3,3],[3,4],[3,5],
                    [3,6],[4,4],[4,5],[4,6],[5,5],[5,6],[6,6]]

    const matrices = createDominoesMatrix(5)
    visual_matrix  = matrices.visual
    data_matrix = matrices.data

    let player1_fichas = player_fichas(fichas)
    
    console.log(player1_fichas)
    
    place_domino([0,1],Position.LEFT)
    place_domino([0,5],Position.LEFT)
    place_domino([4,5],Position.RIGHT)
    place_domino([4,1],Position.RIGHT)



    console.log(visual_matrix)
    console.log(data_matrix)    
    console.log(left_domino.values)
    console.log(right_domino.values)
}


function place_domino(domino_to_place, position){
    
    if (fichas_placed == 0){
        let current_domino = new Domino(domino_to_place,[2,2],
                            DisplayDirection.HORIZONTAL)
        left_domino = current_domino
        right_domino = current_domino

        visual_matrix[2][2] = domino_to_place
        data_matrix[2][2] = current_domino
    }else{
        
        let adyance_domino;
        if(position == Position.LEFT){
            adyance_domino = left_domino
        }else{
            adyance_domino = right_domino
        }

        let is_legal = true
        let number_to_place;
        if(adyance_domino.freeCorners.includes(domino_to_place[0])){
            number_to_place = domino_to_place[0]
        }else if(adyance_domino.freeCorners.includes(domino_to_place[1])){
            number_to_place = domino_to_place[1]
        }else{
            is_legal = false
        }

        if(is_legal){
            let new_coords = [adyance_domino.coords[0], adyance_domino.coords[1]+position]
            let current_domino = new Domino(domino_to_place, 
                                new_coords,
                                DisplayDirection.HORIZONTAL)
            adyance_domino.removeCorner(number_to_place)
            current_domino.removeCorner(number_to_place)
                
            if(position == Position.LEFT){
                left_domino = current_domino
            }else if (position == Position.RIGHT){
                right_domino = current_domino
            }
            visual_matrix[new_coords[0]][new_coords[1]] = domino_to_place
            data_matrix[new_coords[0]][new_coords[1]] = current_domino
        }
    }
    fichas_placed++;
}

main()