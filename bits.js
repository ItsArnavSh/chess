"use strict";
let turn=1;
let gamer;
document.addEventListener("DOMContentLoaded",()=>{
    //This function is called when the DOM is loaded
    makeBoxes();
    gamer=setPieces();
    display(gamer);
    let keys = document.querySelectorAll(".box");
    for(let i = 0;i<keys.length;i++)
    {
        keys[i].onclick = ({target})=>{clicked(target);}
    }
});
//To work with bits, we will assume the chessboard to go from 1 to 64 instead of a8 to h1.
/*
For Reference
01 02 03 04 05 06 07 08
09 10 11 12 13 14 15 16
17 18 19 20 21 22 23 24
25 26 27 28 29 30 31 32
33 34 35 36 37 38 39 40
41 42 43 44 45 46 47 48
49 50 51 52 53 54 55 56
57 58 59 60 61 62 63 64
*/
////////////////////////////////////////

function positionToBit(n) {
    //This function will take a number, and return 1, shifted by that number. 
    //eg 3 returns 100
    if (typeof n === 'number') {
        n=n-1;
        return(1n<<BigInt(n));
    } else if (Array.isArray(n)) {
        let k = 0n;
        for(let i=0;i<n.length;i++)
        {
            n[i]--;
            k=k|(1n<<BigInt(n[i]));
        }
        return k;
    } else {
        throw new Error('Invalid argument type, expected letter or array');
    }
}
function setPieces()//This will initialize all the pieces
{
    let gamer=[];
    /*
    0-5 Black's pieces
    0-king
    1-queen
    2-rooks
    3-knights
    4-bishops
    5-pawns
    6-11 White's pieces
    //same as white +6
    12 and 13 all black and white pieces
    14- GameState TKQkqE T turn, KQkq means castle in FEN terms and E means en passant avaibility
    15- Available En passant square, if not available, it is 0
    */
    // Black pieces
    gamer.push(positionToBit(5)); // Black king
    gamer.push(positionToBit(4)); // Black queen
    gamer.push(positionToBit([1, 8])); // Black rooks
    gamer.push(positionToBit([2, 7])); // Black knights
    gamer.push(positionToBit([3, 6])); // Black bishops
    gamer.push(positionToBit([9, 10, 11, 12, 13, 14, 15, 16])); // Black pawns

    // White pieces
    gamer.push(positionToBit(61)); // White king
    gamer.push(positionToBit(60)); // White queen
    gamer.push(positionToBit([57, 64])); // White rooks
    gamer.push(positionToBit([58, 63])); // White knights
    gamer.push(positionToBit([59, 62])); // White bishops
    gamer.push(positionToBit([49, 50, 51, 52, 53, 54, 55, 56])); // White pawns
    gamer.push(positionToBit([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16])); // All black pieces
    gamer.push(positionToBit([49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64])); // All white pieces
    //For gamestate
    gamer.push(positionToBit([1,2,3,4,5]));
    gamer.push(positionToBit(0));//No enpassant sqares at the start of the game
    return gamer;

}
function converter(bitmap)
{
    //It takes the bitmap of the board, and returns an array of coordinates with the elements which had a 1
    let coordinate = [];
    for(let i=8;i>=1;i--)
    {
        for(let j='a'.charCodeAt(0);j<='h'.charCodeAt(0);j++)
        {
            let id = (`${String.fromCharCode(j)}${i}`);
            if((bitmap&1n)==1n)
                coordinate.push(id);
            bitmap=bitmap>>1n;
        }
    }
    return coordinate;
}
function antiConverter(coord)
{
    //It takes a string or an array of strings and returns a bitboard with those parts marked
    //We will make a formula to convert the string to the numerical notation and then the bit
    let x = charToNumber(coord[0]);
    let y = 9-numcharToNumber(coord[1]);
    return(x+8*(y-1));
}
function charToNumber(c) {
    return c.charCodeAt(0) - 'a'.charCodeAt(0)+1;
}
function numcharToNumber(c) {
    return c.charCodeAt(0) - '0'.charCodeAt(0);
}
function makeBoxes()
    {
        let gamer = {};
        const board = document.getElementById("board");
    for(let i=8;i>=1;i--)
    {
        for(let j='a'.charCodeAt(0);j<='h'.charCodeAt(0);j++)
        {
            const box = document.createElement("button");
            box.classList.add("box");
            box.id = (`${String.fromCharCode(j)}${i}`);
            if((i+j)%2==0)
                box.classList.add("odd");
            else
                box.classList.add("even");
            gamer[`${String.fromCharCode(j)}${i}`] = null;
            board.appendChild(box);
        }
    }
};
function display(gamer) {
    // The display will refresh every single move
    let coord;
    let keys;
    
    const pieceNames = ["king-b", "queen-b", "rook-b", "knight-b", "bishop-b", "pawn-b", "king-w", "queen-w", "rook-w", "knight-w", "bishop-w", "pawn-w"];
    const pieceCounts = [1, 1, 2, 2, 2, 8, 1, 1, 2, 2, 2, 8];

    for (let i = 0; i < pieceNames.length; i++) {
        let coords = converter(gamer[i]);
        for (let j = 0; j < pieceCounts[i]; j++) {
            coord = coords[j];
            keys = document.getElementById(coord);
            const img = document.createElement("img");
            img.src = `pieces/${pieceNames[i]}.svg`;
            img.height = 43;
            img.style.backgroundColor = 'transparent';
            img.style.pointerEvents = 'none';
            keys.appendChild(img);
        }
    }
}
function clicked(target)
{
    turn = gamer[14]&1n;
    const key = target.getAttribute("id");
    const clickedBitMap = positionToBit(antiConverter(key));
    if((clickedBitMap&gamer[13]))
    {
        console.log("Your Piece")
        console.log(converter(whichPieceIsInvoked(clickedBitMap)));
    }
    else if((clickedBitMap&gamer[12]))
    {
        console.log("Opponent's piece");
    }
    else
        console.log("Empty Space");

}
function whichPieceIsInvoked(bitboard)
{
    //Accepts the bitboard of clicked piece and returns the bitboard with all attacks available
    //First we need to figure out which piece is it
    let range = gamer[14]&1n?6:0;
    for(let i = range; i < range + 6; i++) {
        if(gamer[i] & bitboard) {
            switch(i % 6) {
                case 0: return king(bitboard);
                case 1: return queen(bitboard);
                case 2: return rook(bitboard);
                case 3: return knight(bitboard);
                case 4: return bishop(bitboard);
                case 5: return pawn(bitboard);
            }
        }
    }
}
function king(bitboard)
{

}
function queen(bitboard)
{
    
}
function rook(bitboard)
{
    
}
function knight(bitboard)
{
    
}
function bishop(bitboard)
{
    
}
function pawn(bitboard)
{
    let direction = gamer[14]&1n?-1:1;
    console.log(direction);
    return shift(bitboard,0,direction);
}
function shift(bitboard,x,y)
{
    //This function will return your shifted bitboard by specified x and y
    let shiftval = x+8*(y);
    return(bitboard<<BigInt(shiftval));
}