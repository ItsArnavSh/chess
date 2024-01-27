"use strict";
//There will be 5 major sections of functions, which I will be calling modules
//Listing to shadow fight 2 soundtrack hits different while coding
//Global Variables:
let turn=1,hc=0,gamer,gamePlay;
//turn 1 means white and 0 means black
//hc 1 means human vs computer and hc 2 means human vs human
document.addEventListener("DOMContentLoaded",()=>
{
    chess();
});
/*
The 5 modules are
- Central -> Connects the human, display and engine
- Display -> Is responsible for the html you see
- Human -> When it is your turn, it will take inputs
- Engine -> The chess Engine
- Mains -> All important functions the are needed by all components
*/
//So first, the chess function is invoked, which is basically the entire game
function chess()
{
    makeBoxes();
    gamer=setPieces();
    display(gamer);
    while(true)
    {
        break;
        //white's turn
        turn=!turn;
        //black's turn
    }
}
//Central//////////////////////////////////////////////////////////////////////
function humanTurn()//checks if its human turn
{
    return true;
}
//Mains////////////////////////////////////////////////////////////////////////
function mapToString(bitmap)
{
    if(bitmap==null)
        return [];
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
function numberToMap(n) {
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
    */
    // Black pieces
    gamer.push(numberToMap(5)); // Black king
    gamer.push(numberToMap(4)); // Black queen
    gamer.push(numberToMap([1, 8])); // Black rooks
    gamer.push(numberToMap([2, 7])); // Black knights
    gamer.push(numberToMap([3, 6])); // Black bishops
    gamer.push(numberToMap([9, 10, 11, 12, 13, 14, 15, 16])); // Black pawns

    // White pieces
    gamer.push(numberToMap(61)); // White king
    gamer.push(numberToMap(34)); // White queen
    gamer.push(numberToMap([37, 64])); // White rooks
    gamer.push(numberToMap([58, 63])); // White knights
    gamer.push(numberToMap([36, 62])); // White bishops
    gamer.push(numberToMap([49, 50, 51, 52, 53, 54, 55, 56])); // White pawns
    /*
      0 and 1 all black and white pieces
      2- GameState TKQkqE T turn, KQkq means castle in FEN terms and E means en passant avaibility
      3- Available En passant square, if not available, it is 0
    */
    let gamer2=[];
    gamer2.push(numberToMap([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16])); // All black pieces
    gamer2.push(numberToMap([49, 50, 51, 52, 53, 54, 55, 56, 37, 58, 36, 34, 61, 62, 63, 64])); // All white pieces
    //For gamestate
    gamer2.push(numberToMap([1,2,3,4,5]));
    gamer2.push(numberToMap(0));//No enpassant sqares at the start of the game
    return [gamer,gamer2];
}
function whichPieceIsInvoked(bitboard)
{
    //Accepts the bitboard of clicked piece and returns the bitboard with all attacks available
    //First we need to figure out which piece is it
    let range = turn==1?6:0;
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
    //Watch this
    /*
    111
    101
    111
    */
   let kingCoord = 0b111101111n;
   //We need to shift the king to the bitboard
   kingCoord=kingCoord<<(numberToMap(bitboard)-9);
    kingCoord&=0b1111111111111111111111111111111111111111111111111111111111111111n;
    kingCoord&=~gamePlay[turn];
    return kingCoord;
}
function queen(bitboard)
{
    return(rook(bitboard)|bishop(bitboard));
}
function rook(bitboard) {
    let attacks = 0n;
    let n = mapToNumber(bitboard)[0];
    //Up
    for(let i= 1; i <= n; i++) {
        let check = shift(bitboard, 0, -i);
        if(check & gamePlay[turn]) {
            break;
        }
        else if(check & gamePlay[turn == 1n ? 0 : 1]) {
            attacks |= check;
            break;
        }
        else {
            attacks |= check;
        }
    }
    // Down
    for(let i= 1; i <= 64 - n; i++) {
    let check = shift(bitboard, 0, i);
    if(check & gamePlay[turn]) {
        break;
    }
    else if(check & gamePlay[turn == 1n ? 0 : 1]) {
        attacks |= check;
        break;
    }
    else {
        attacks |= check;
    }
}
    // Left
for(let i= 1; i <= n % 8; i++) {
    let check = shift(bitboard, -i, 0);
    console.log(mapToNumber(check)[0]);
    if(check & gamePlay[turn]) {
        break;
    }
    else if(check & gamePlay[turn == 1n ? 0 : 1]) {
        attacks |= check;
        break;
    }
    else {
        attacks |= check;
    }
    if((mapToNumber(bitboard)[0]-1)%8==0)
        break;
}

// Right
for(let i= 1; i <= 8 - n % 8; i++) {
    let check = shift(bitboard, i, 0);
    if(check & gamePlay[turn]) {
        break;
    }
    else if(check & gamePlay[turn == 1n ? 0 : 1]) {
        attacks |= check;
        break;
    }
    else {
        attacks |= check;
    }
}
    return attacks;
}
function knight(bitboard) {
    let attacks = 0n;
    let n = mapToNumber(bitboard)[0];

    // Define all possible knight moves
    let moves = [
        [-2, -1], [-2, 1], [-1, -2], [-1, 2],
        [1, -2], [1, 2], [2, -1], [2, 1]
    ];
    for(let move of moves) {
        let check = shift(bitboard, move[0], move[1]);
        if(!(check & gamePlay[turn])) {
                attacks |= check;
        }
    }

    return attacks;
}
function bishop(bitboard) {
    let attacks = 0n;
    let n = mapToNumber(bitboard)[0];

    // Up-Left
    for(let i= 1; i <= Math.min(n % 8, Math.floor(n / 8)); i++) {
        let check = shift(bitboard, -i, -i);
        if(check & gamePlay[turn]) {
            break;
        }
        else if(check & gamePlay[turn == 1n ? 0 : 1]) {
            attacks |= check;
            break;
        }
        else {
            attacks |= check;
        }
    }

    // Up-Right
    for(let i= 1; i <= Math.min(8 - n % 8, Math.floor(n / 8)); i++) {
        let check = shift(bitboard, i, -i);
        if(check & gamePlay[turn]) {
            break;
        }
        else if(check & gamePlay[turn == 1n ? 0 : 1]) {
            attacks |= check;
            break;
        }
        else {
            attacks |= check;
        }
    }

    // Down-Left
    for(let i= 1; i <= Math.min(n % 8, 64 - n / 8); i++) {
        let check = shift(bitboard, -i, i);
        if(check & gamePlay[turn]) {
            break;
        }
        else if(check & gamePlay[turn == 1n ? 0 : 1]) {
            attacks |= check;
            break;
        }
        else {
            attacks |= check;
        }
    }

    // Down-Right
    for(let i= 1; i <= Math.min(8 - n % 8, 64 - n / 8); i++) {
        let check = shift(bitboard, i, i);
        if(check & gamePlay[turn]) {
            break;
        }
        else if(check & gamePlay[turn == 1n ? 0 : 1]) {
            attacks |= check;
            break;
        }
        else {
            attacks |= check;
        }
    }

    return attacks;
}
function pawn(bitboard)
{
    let direction = turn?-1:1;
    return shift(bitboard,0,direction);
}
//Human////////////////////////////////////////////////////////////////////////
//Computer/////////////////////////////////////////////////////////////////////
//Display//////////////////////////////////////////////////////////////////////
//This will allot the boxes to the grid
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
function display(gamer)
{
    //It will display all the pieces
    const pieceNames = ["king-b", "queen-b", "rook-b", "knight-b", "bishop-b", "pawn-b", "king-w", "queen-w", "rook-w", "knight-w", "bishop-w", "pawn-w"];
    
}