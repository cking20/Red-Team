var row = 11;
var column = 11;
var tileSlotNumber = 7;

// data object
var data = {
    selectedTileId: '',
    selectedTileParentId: '',
    selectedSquareId: '',
    // can change to computed property
    rows: generateTableRows(),
    squares: generateSquares(),
    tileSlots: generateTileSlots(),
    TilesOnBoard: []
}

function generateTableRows () {
    var tableRows = [];
    for (var i = 0; i < row; i++) {
        tableRows.push(i);
    }
    return tableRows;
}

function generateSquares () {
    var squares = [];
    for (var i = 0; i < row; i++) {
        for (var j = 0; j < column; j++) {
            // use sum to render square background color 
            var sum = i + j;
            switch(sum) {
                case 1: case 3: case 5: case 7: case 9: case 11: case 13: case 15: case 17: case 19:
                    squares.push({id: 'square-' + i + '-' + j, xAxis: i, yAxis: j, isSquareGreen: true, isSquareYellow: false});
                    break;
                default:
                    squares.push({id: 'square-' + i + '-' + j, xAxis: i, yAxis: j, isSquareGreen: false, isSquareYellow: false});
                    break;
            }
        }
    }
    
    return squares;
}

function generateTileSlots () {
    var tileSlots = [];
    for (var i = 0; i < this.tileSlotNumber; i++) {
        tileSlots.push({id: 'slot' + i});
    }
    return tileSlots;
}

var drag = function (ev) {   
    ev.dataTransfer.setData("text", ev.target.id);
}

var allowDrop = function (ev) {
    ev.preventDefault();
}

var drop = function (ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.target.innerHTML = ""; ev.target.appendChild(document.getElementById(data));
    
    
    // test
    var isDoubleScore = false;
    var i;
    for(i = 0; i < this.doubleScoreGameBoardBlocks.length; i++) {
        //console.log(ev.target.id + " " + this.doubleScoreGameBoardBlocks[i] + "\n");
        if (ev.target.id === this.doubleScoreGameBoardBlocks[i]) {
            isDoubleScore = true; 
            break;
        }
    }
    
    //console.log(isDoubleScore);
    
    if(isDoubleScore) {
        this.accumulator += (2 * this.scoreUnit);
    } else {
        this.accumulator += this.scoreUnit;
    }
}

// when clicking on a tile in a tile slot or in the game board 
var selectAndDeselectTile = function (tileId) {
    // get the tile
    var tile = document.getElementById(tileId);
    // set tile border color 
    //tile.children.stroke = "red"; (20180304 not working)
    var wrapper = tile.parentNode.parentNode.parentNode; 
    //console.log(wrapper);
    // get Tile ID
    this.selectedTileId = tileId; 
    // selet tile
    if (wrapper.className === 'wrapper-slots') {
        var tile = document.getElementById(tileId);
        // get Parent ID
        var parentId = tile.parentNode.id;
        this.selectedTileParentId = parentId;
        //
        this.TilesOnBoard.push({tileId: tileId, parentId: parentId});
        //console.log(this.selectedTileParentId);
          
        console.log(tile.children[1].innerHTML);
        //console.log(tile.lastChild.innerHTML);
    }
    // deselect tile
    else {
        // find parent id
        for(var i = 0; i < this.TilesOnBoard.length; i++) {
            if (this.TilesOnBoard[i].tileId === this.selectedTileId) {
                this.selectedTileParentId = this.TilesOnBoard[i].parentId;
                this.TilesOnBoard.splice(i, 1);
            }
        }
        
        // put tile back to slot
        var selectedTile = document.getElementById(this.selectedTileId);
        
        //console.log(selectedTile);
        // resize the tile (old way)
        //selectedTile.className = 'slot-tile-size';
        document.getElementById(this.selectedTileParentId).appendChild(selectedTile);
        
        this.selectedTileId = '';

    }
}

// when clicking on a square in the game board
var putTileInSquare = function (squareId) {
    //if(this.selectedTileId !== '' && this.selectedSquareId !== squareId) {
    
    if(this.selectedTileId !== '') {
        var selectedTile = document.getElementById(this.selectedTileId);
        // resize the tile (old way)
        //selectedTile.className = 'game-board-tile-size';
        var selectedSquare = document.getElementById(squareId);
        selectedSquare.clear;
        selectedSquare.appendChild(selectedTile);
        //this.selectedTileId = '';
        this.selectedSquareId = selectedSquare.id;
    }
}

var svg = function (id, letter, value) {
    
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("id", id); 
    // test (looks the same but not working)
    //svg.setAttribute("v-on:click", "onClickTile('"+ id +"')");
    // considering changeing this from window to this 
    //svg.addEventListener("v-on:click", selectAndDeselectTile(id));
    
    var rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttributeNS(null, "x", "0");
    rect.setAttributeNS(null, "y", "0");
    rect.setAttributeNS(null, "stroke", "black");
    rect.setAttributeNS(null, "stroke-width", "1px");
    rect.setAttributeNS(null, "width", "100%");
    rect.setAttributeNS(null, "height", "100%");
    rect.setAttributeNS(null, "fill", "#f4dc00");
    
    var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", "50%");
    text.setAttribute("y", "60%");
    text.setAttribute("alignment-baseline", "middle");
    text.setAttribute("text-anchor", "middle");
    text.innerHTML = letter;
    
    var letterValue = document.createElementNS("http://www.w3.org/2000/svg", "text");
    letterValue.setAttribute("x", "70%");
    letterValue.setAttribute("y", "30%");
    letterValue.setAttribute("class", "letter-value");
    letterValue.innerHTML = value;
    
    svg.appendChild(rect);                  
    svg.appendChild(text); 
    svg.appendChild(letterValue);
    
    return svg;
}

