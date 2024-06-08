"use strict";
let turn=1;
let gamer;
let gamePlay;
let prev,prevMove;
document.addEventListener("DOMContentLoaded",()=>{
    //This function is called when the DOM is loaded
    makeBoxes();
    [gamer,gamePlay]=setPieces();
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
function setPieces() {
    let gamer = [];
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
    gamer.push(numberToMap(5)); // Black king on e8 (5th position)
    gamer.push(numberToMap(4)); // Black queen on d8 (4th position)
    gamer.push(numberToMap([1, 8])); // Black rooks on a8 and h8
    gamer.push(numberToMap([2, 7])); // Black knights on b8 and g8
    gamer.push(numberToMap([3, 6])); // Black bishops on c8 and f8
    gamer.push(numberToMap([9, 10, 11, 12, 13, 14, 15, 16])); // Black pawns on a7 to h7

    // White pieces
    gamer.push(numberToMap(61)); // White king on e1 (61st position)
    gamer.push(numberToMap(60)); // White queen on d1 (60th position)
    gamer.push(numberToMap([57, 64])); // White rooks on a1 and h1
    gamer.push(numberToMap([58, 63])); // White knights on b1 and g1
    gamer.push(numberToMap([59, 62])); // White bishops on c1 and f1
    gamer.push(numberToMap([49, 50, 51, 52, 53, 54, 55, 56])); // White pawns on a2 to h2

    /*
      0 and 1 all black and white pieces
      2- GameState TKQkqE T turn, KQkq means castle in FEN terms and E means en passant availability
      3- Available En passant square, if not available, it is 0
    */
    let gamer2 = [];
    gamer2.push(numberToMap([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16])); // All black pieces
    gamer2.push(numberToMap([49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64])); // All white pieces

    // For game state
    gamer2.push(numberToMap([1, 2, 3, 4, 5])); // Initial state, allow all castling options
    gamer2.push(numberToMap(0)); // No en passant squares at the start of the game

    return [gamer, gamer2];
}
function mapToNumber(bitmap)
{
    //We are given a map and we should return an array of coordinates
    let coordinate=[];
    for(let i=1;i<=64;i++)
    {
        if((bitmap&1n)==1n)
                coordinate.push(i);
            bitmap=bitmap>>1n;
    }
    return coordinate;
}
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
function coordToNum(coord)
{
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
    for(let i=1;i<=64;i++)
    {
        const clearer = document.getElementById(mapToString(numberToMap(i)));
        clearer.innerHTML="";
    }
    let coord;
    let keys;
    
    const pieceNames = ["king-b", "queen-b", "rook-b", "knight-b", "bishop-b", "pawn-b", "king-w", "queen-w", "rook-w", "knight-w", "bishop-w", "pawn-w"];
    const pieceCounts = [1, 1, 2, 2, 2, 8, 1, 1, 2, 2, 2, 8];

    for (let i = 0; i < pieceNames.length; i++) {
        let coords = mapToString(gamer[i]);
        for (let j = 0; j < pieceCounts[i]; j++) {
            coord = coords[j];
            keys = document.getElementById(coord);
            if(keys!=null)
            {
                const img = document.createElement("img");
                img.src = `pieces/${pieceNames[i]}.svg`;
                img.height = 43;
                img.style.backgroundColor = 'transparent';
                img.style.pointerEvents = 'none';
                keys.appendChild(img);
            }
        }
    }
}
function clicked(target)
{
    clear();
    const key = target.getAttribute("id");
    const clickedBitMap = numberToMap(coordToNum(key));
    if((clickedBitMap&gamePlay[turn]))
    {
        let moves = (mapToString(whichPieceIsInvoked(clickedBitMap)));
        for(let j=0;j<moves.length;j++)
        {
            let change = document.getElementById(moves[j]);
            if(numberToMap(coordToNum(moves[j]))&gamePlay[turn == 1n ? 0 : 1])
            {
                change.style.border = '2px solid red';
                change.classList.add("red");
            }
            else
            {
            let indicator = document.createElement("img");
            indicator.src = "pieces/blackDot.png";
            indicator.height=20;
            indicator.classList.add("temp");
            indicator.style.backgroundColor = 'transparent';
            indicator.style.pointerEvents = 'none';
            if((moves[j].charCodeAt(0)+parseInt(moves[j][1],10))%2==0)
            {
                indicator.style.filter = 'brightness(500%)';
                indicator.style.opacity = '0.2';
            }
            //piece.charCodeAt(0)+x)}${parseInt(piece[1],10)+y
            indicator.style.opacity = '0.2';
            change.appendChild(indicator);
            }
        }
        prevMove = clickedBitMap;
        prev = (whichPieceIsInvoked(clickedBitMap));
    }
    else if(prev!=undefined && (clickedBitMap & prev))
    {
        gamePlay[turn]&=~prevMove;
        gamePlay[turn]|=clickedBitMap;
        for(let i=0;i<12;i++)
        {
            if(gamer[i]&clickedBitMap)
            {
                gamer[i]&=~clickedBitMap;
                gamePlay[turn==1?0:1]&=~clickedBitMap;
            }
            if(gamer[i]&prevMove)
            {
                gamer[i]&=~prevMove;
                gamer[i]|=clickedBitMap;
            }
        }
        display(gamer);
        turn=turn==1?0:1;
        console.log("Move: ",turn);
        prevMove = undefined;
        prev = undefined;
    }
    else
        console.log("Empty Space");

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
    11100000
    10100000
    11100000
    */
   //This is called a cool algorithm
   //We find the distance between this bitboard shown above and our piece
   //Then drag it there, like a lookup blueprint
    let kingCoord = 0b111000001010000011100000n;//the same pattern
    //We need to shift the king to the bitboard
    kingCoord=kingCoord<<(BigInt(mapToNumber(bitboard)[0])-15n);
    //
     kingCoord&=0b1111111111111111111111111111111111111111111111111111111111111111n;
     //TLA will delete any values over 64 bits
     // eg 101 & 11 is 01, just that but for 64 bits
     kingCoord&=~gamePlay[turn];
     //TLA will remove any coordinates that coincide with our own pieces
     //We wont attack them
     //Now there is an issue
     //The piece when at corner would project its pieces and they got leaked to the other end
     //As the bitboard is just one huge single dimensional array
     //To prevent this, we see which side the piece is on and clear off the other side
     //This bit notation below refers to the second half of the board
     //To see if the piece is located in the second half
     if(bitboard & 0b1111000011110000111100001111000011110000111100001111000011110000n)
        kingCoord&=0b1111110011111100111111001111110011111100111111001111110011111100n;
    //This notation will delete any pieces in the last two blocks
    else
        kingCoord&=0b0011111100111111001111110011111100111111001111110011111100111111n;
    return kingCoord;
}
function queen(bitboard)
{
    //Queen is just rook and bishop combined
    return(rook(bitboard)|bishop(bitboard));
}
function rook(bitboard)
{
    //I will break it down for you guys
    //Bear with me
    //first we make an empty map like this one
    let rookCoord = 0b0n;
    //A rook goes up down left right
    //We need to compute each path
    //Going Down
    let temp = bitboard;
    //The boundary condition for down
    //11111111n<<64 is larger than ant position
    //So if temp and that mess is not zero, that number gotta be larger than needed
    //Hence that will be beyond the boundary and we break the loop
    while(!(temp&(1111111n<<64n)))//number is smaller than 64 bits
    {
        //We are working with a board right
        //Each one has a row of 8
        //So we will left shift the coordinate
        //That will take us one step down
        temp=temp<<8n;
        if(gamePlay[turn]&temp)
        //If we step on our own piece, we quit the scan in that direction
            break;
        else if(BigInt(gamePlay[turn==1?0:1])&temp)
        {
        //If we step on their own piece,we add that to the move
        //As we can capture those
        //Then we quit the scan in that direction
            rookCoord|=temp;
            break;
        }
        //If nothing happens, we will add them
        rookCoord|=temp;
    }
    //We need to refresh temp after every term
    temp = bitboard;
    //Going up
    while(temp)
    {
        //As we are right shifting this time
        //This will make it go zero in some terms
        //Easy, not like that previous mess
        temp=temp>>8n;
        if(gamePlay[turn]&temp)
            break;
        else if(BigInt(gamePlay[turn==1?0:1])&temp)
        {
            rookCoord|=temp;
            break;
        }
        rookCoord|=temp;
    }
    temp = bitboard;
    //Going left
    //The first temp is if that rook is at the top and has no one to subtract to behind it
    //The boundary condition checks if the rook is on the left wall
    //We shift it to the right wall and then & it with all right wall coordinates
    //IF they return 1, means they have to be at left wall
    while(temp && (!((temp>>1n)&(0b00000001000000010000000100000001000000010000000100000001000000010000000n))))
    {
        temp=temp>>1n;
        if(gamePlay[turn]&temp)
            break;
        else if(BigInt(gamePlay[turn==1?0:1])&temp)
        {
            rookCoord|=temp;
            break;
        }
        rookCoord|=temp;
    }
    temp = bitboard;
    //Going Right
    //Same as left, just without the shifting
    //As we just have to see if they are at right
    while(!((temp)&(0b00000001000000010000000100000001000000010000000100000001000000010000000n)))
    {
        temp=temp<<1n;
        if(gamePlay[turn]&temp)
            break;
        else if(BigInt(gamePlay[turn==1?0:1])&temp)
        {
            rookCoord|=temp;
            break;
        }
        rookCoord|=temp;
    }
    return rookCoord;
}
function knight(bitboard) {
    //Watch this
    /*
    01010000
    10001000
    00o00000
    10001000
    01010000
    */
    let knightCoord = 0b0101000010001000000000001000100001010000n;
    //We need to shift the knight to the bitboard
    console.log(typeof(mapToNumber(bitboard)[0]));
    knightCoord=knightCoord<<(BigInt(mapToNumber(bitboard)[0])-22n);
    knightCoord&=0b1111111111111111111111111111111111111111111111111111111111111111n;
     knightCoord&=~gamePlay[turn];
     console.log(mapToNumber(knightCoord));
     if(bitboard & 0b1111000011110000111100001111000011110000111100001111000011110000n)
     knightCoord&=0b1111110011111100111111001111110011111100111111001111110011111100n;
    else
     knightCoord&=0b0011111100111111001111110011111100111111001111110011111100111111n;
    return knightCoord;
}
function bishop(bitboard)
{
    let bishopCoord=0b0n;
    //Up Left
    let temp = bitboard;
    while(temp && !((temp>>1n)&(0b00000001000000010000000100000001000000010000000100000001000000010000000n)))
    {
        temp=temp>>9n;
        if(gamePlay[turn]&temp)
            break;
        else if(BigInt(gamePlay[turn==1?0:1])&temp)
        {
            bishopCoord|=temp;
            break;
        }
        bishopCoord|=temp;
    }
    //Up Right
    temp = bitboard;
    while(temp && !((temp)&(0b00000001000000010000000100000001000000010000000100000001000000010000000n)))
    {
        temp=temp>>7n;
        if(gamePlay[turn]&temp)
            break;
        else if(BigInt(gamePlay[turn==1?0:1])&temp)
        {
            bishopCoord|=temp;
            break;
        }
        bishopCoord|=temp;
    }
    //Down Left
    temp = bitboard;
    while((!(temp&(11111111n<<64n))) && (!((temp>>1n)&(0b00000001000000010000000100000001000000010000000100000001000000010000000n))))
    {
        console.log(!(temp&(1111111n<<64n))) && (!((temp>>1n)&(0b00000001000000010000000100000001000000010000000100000001000000010000000n)));
        temp=temp<<7n;
        if(gamePlay[turn]&temp)
            break;
        else if(BigInt(gamePlay[turn==1?0:1])&temp)
        {
            bishopCoord|=temp;
            break;
        }
        bishopCoord|=temp;
    }
    //Down right
    temp = bitboard;
    while((!(temp&(11111111n<<64n))) && (!((temp)&(0b00000001000000010000000100000001000000010000000100000001000000010000000n))))
    {
        temp=temp<<9n;
        if(gamePlay[turn]&temp)
            break;
        else if(BigInt(gamePlay[turn==1?0:1])&temp)
        {
            bishopCoord|=temp;
            break;
        }
        bishopCoord|=temp;
    }
    return bishopCoord;
}
function pawn(bitboard) {

    let isWhite = !turn;
    let pawnCoord = 0b0n;
    let opponentPieces = gamePlay[turn == 1 ? 0 : 1];

    // Pawns move differently based on color
    if (isWhite) {
        // White pawns move up the board (shift left)
        let moveOneStep = bitboard << 8n;
        let moveTwoSteps = bitboard << 16n;

        // Check if the move is valid
        moveOneStep &= ~gamePlay[0] & ~gamePlay[1]; // No pieces in the way
        moveTwoSteps &= ~gamePlay[0] & ~gamePlay[1] & (0xFF00FF0000000000n); // No pieces in the way and on starting position

        // Check captures (diagonal moves)
        let captureLeft = (bitboard << 7n) & opponentPieces & 0xFEFEFEFEFEFEFEFEn; // Capture left
        let captureRight = (bitboard << 9n) & opponentPieces & 0x7F7F7F7F7F7F7F7Fn; // Capture right

        pawnCoord |= moveOneStep | moveTwoSteps | captureLeft | captureRight;

    } else {
        // Black pawns move down the board (shift right)
        let moveOneStep = bitboard >> 8n;
        let moveTwoSteps = bitboard >> 16n;

        // Check if the move is valid
        moveOneStep &= ~gamePlay[0] & ~gamePlay[1]; // No pieces in the way
        moveTwoSteps &= ~gamePlay[0] & ~gamePlay[1] & (0x0000000000FF0000n); // No pieces in the way and on starting position

        // Check captures (diagonal moves)
        let captureLeft = (bitboard >> 9n) & opponentPieces & 0xFEFEFEFEFEFEFEFEn; // Capture left
        let captureRight = (bitboard >> 7n) & opponentPieces & 0x7F7F7F7F7F7F7F7Fn; // Capture right

        pawnCoord |= moveOneStep | moveTwoSteps | captureLeft | captureRight;
    }

    return pawnCoord;
}

function shift(bitboard,x,y)
{
    //This function will return your shifted bitboard by specified x and y
    let shiftval = x+8*(y);
    return(bitboard<<BigInt(shiftval));
}
function distanceBetweenStrings(a, b) {
    console.log(a,b);
    // Convert the chess coordinates to 0-based indices
    let x1 = a.charCodeAt(0) - 'a'.charCodeAt(0);
    let y1 = parseInt(a[1]) - 1;
    let x2 = b.charCodeAt(0) - 'a'.charCodeAt(0);
    let y2 = parseInt(b[1]) - 1;

    // Calculate the distances in the x and y axes
    let dx = Math.abs(x2 - x1);
    let dy = Math.abs(y2 - y1);

    // Return the larger distance
    return Math.max(dx, dy);
}
function clear() {
    let elements = document.getElementsByClassName('temp');
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }
    elements = document.getElementsByClassName('red');
    for(let l = 0;l<elements.length;l++)
    {
        elements[l].style.border = "1px solid black";
    }
}