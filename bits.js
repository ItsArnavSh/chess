"use strict";
document.addEventListener("DOMContentLoaded",()=>{
    //This function is called when the DOM is loaded
    makeBoxes();
    let boardState = initializeChessPieces();
    display(gamer);
    let keys = document.querySelectorAll(".box");
    let currentTurn = 1;
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
function initializeChessPieces()//This will initialize all the pieces
{
    let gamer=[];
    gamer.push(numberToMap([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16])); // All black pieces
    gamer.push(numberToMap([49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64])); // All white pieces
    //For gamestate
    gamer.push(numberToMap([1,2,3,4,]));
    gamer.push(numberToMap(0));//No enpassant sqares at the start of the game
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
    gamer.push(numberToMap(60)); // White queen
    gamer.push(numberToMap([57, 64])); // White rooks
    gamer.push(numberToMap([58, 63])); // White knights
    gamer.push(numberToMap([59, 62])); // White bishops
    gamer.push(numberToMap([49, 50, 51, 52, 53, 54, 55, 56])); // White pawns
    /*
      0 and 1 all black and white pieces
      2- GameState TKQkqE T turn, KQkq means castle in FEN terms and E means en passant avaibility
      3- Available En passant square, if not available, it is 0
    */
    return gamer;
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
    let [black,white]=evaluation(gamer);
    let wpercent = Math.round(white*1000/(white+black));
    let bpercent = 1000-wpercent;
    const find = document.getElementById("eval")
    const find2 = document.getElementById("eval2")
    find.innerHTML="";
    find2.innerHTML="";
        while(bpercent!=0)
        {
            const b = document.createElement("div");
            b.classList.add("eblack");
            find.appendChild(b);
            const c = document.createElement("div");
            c.classList.add("eblack");
            find.appendChild(b);
            find2.appendChild(c);
            bpercent--;
        }
        while(wpercent!=0)
        {
            const b = document.createElement("div");
            b.classList.add("ewhite");
            find.appendChild(b);
            const c = document.createElement("div");
            c.classList.add("ewhite");
            find.appendChild(b);
            find2.appendChild(c);
            wpercent--;
        }
    // The display will refresh every single move
    for(let i=1;i<=64;i++)
    {
        const clearer = document.getElementById(mapToString(numberToMap(i)));
        clearer.innerHTML="";
    }
    let coord;
    let keys;
    
    const pieceNames = ["king-b", "queen-b", "rook-b", "knight-b", "bishop-b", "pawn-b", "king-w", "queen-w", "rook-w", "knight-w", "bishop-w", "pawn-w"];
    const pieceCounts = [1, 9, 2, 2, 2, 8, 1, 9, 2, 2, 2, 8];

    for (let i = 0; i < pieceNames.length; i++) {
        let coords = mapToString(gamer[i]);
        for (let j = 0; j < pieceCounts[i]; j++) {
            coord = coords[j];
            keys = document.getElementById(coord);
            if(keys!=null)
            {
                const img = document.createElement("img");                img.src = `pieces/${pieceNames[i]}.svg`;
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
        let moves = (mapToString(whichPieceIsInvoked(turn,clickedBitMap)[0]));
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
        prev = (whichPieceIsInvoked(turn,clickedBitMap))[0];
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
        //Checks for promotion
        promotion(clickedBitMap);
        //updates en passant square
        display(gamer);
        turn=turn==1?0:1;
        prevMove = undefined;
        prev = undefined;
    }
}
function whichPieceIsInvoked(player,bitboard,board = gamer,gamestate = gamePlay)
{
    //Accepts the bitboard of clicked piece and returns the bitboard with all attacks available
    //First we need to figure out which piece is it
    let range = player==1?6:0;
    for(let i = range; i < range + 6; i++) {
        if(BigInt(board[i]) & BigInt(bitboard)) {
            switch(i % 6) {
                case 0: return [king(player,bitboard,board = gamer),player*6];
                case 1: return [queen(player,bitboard),1+player*6];
                case 2: return [rook(player,bitboard),2+player*6];
                case 3: return [knight(player,bitboard),3+player*6];
                case 4: return [bishop(player,bitboard),4+player*6];
                case 5: return [pawn(player,bitboard),5+player*6];
            }
        }
    }
}
function king(player,bitboard)
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
     kingCoord&=~gamePlay[player];
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
function queen(player,bitboard)
{
    //Queen is just rook and bishop combined
    return(rook(player,bitboard)|bishop(player,bitboard));
}
function rook(player,bitboard)
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
    while(!(temp&(11111111n<<64n)))//number is smaller than 64 bits
    {
        //We are working with a board right
        //Each one has a row of 8
        //So we will left shift the coordinate
        //That will take us one step down
        temp=temp<<8n;
        if(gamePlay[player]&temp)
        //If we step on our own piece, we quit the scan in that direction
            break;
        else if(BigInt(gamePlay[player==1?0:1])&temp)
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
        if(gamePlay[player]&temp)
            break;
        else if(BigInt(gamePlay[player==1?0:1])&temp)
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
        if(gamePlay[player]&temp)
            break;
        else if(BigInt(gamePlay[player==1?0:1])&temp)
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
        if(gamePlay[player]&temp)
            break;
        else if(BigInt(gamePlay[player==1?0:1])&temp)
        {
            rookCoord|=temp;
            break;
        }
        rookCoord|=temp;
    }
    return rookCoord;
}
function knight(player,bitboard) {
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
    knightCoord=knightCoord<<(BigInt(mapToNumber(bitboard)[0])-22n);
    knightCoord&=0b1111111111111111111111111111111111111111111111111111111111111111n;
     knightCoord&=~gamePlay[player];
     if(bitboard & 0b1111000011110000111100001111000011110000111100001111000011110000n)
     knightCoord&=0b1111110011111100111111001111110011111100111111001111110011111100n;
    else
     knightCoord&=0b0011111100111111001111110011111100111111001111110011111100111111n;
    return knightCoord;
}
function bishop(player,bitboard)
{
    let bishopCoord=0b0n;
    //Up Left
    let temp = bitboard;
    while(temp && !((temp>>1n)&(0b00000001000000010000000100000001000000010000000100000001000000010000000n)))
    {
        temp=temp>>9n;
        if(gamePlay[player]&temp)
            break;
        else if(BigInt(gamePlay[player==1?0:1])&temp)
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
        if(gamePlay[player]&temp)
            break;
        else if(BigInt(gamePlay[player==1?0:1])&temp)
        {
            bishopCoord|=temp;
            break;
        }
        bishopCoord|=temp;
    }
    //Down Left
    temp = bitboard;
    while((!(temp&(11111111n<<64n))) &&temp&& (!((temp>>1n)&(0b00000001000000010000000100000001000000010000000100000001000000010000000n))))
    {
        temp=temp<<7n;
        if(gamePlay[player]&temp)
            break;
        else if(BigInt(gamePlay[player==1?0:1])&temp)
        {
            bishopCoord|=temp;
            break;
        }
        bishopCoord|=temp;
    }
    //Down right
    temp = bitboard;
    while((!(temp&(1111111n<<64n))) && (!((temp)&(0b00000001000000010000000100000001000000010000000100000001000000010000000n))))
    {
        temp=temp<<9n;
        if(gamePlay[player]&temp)
            break;
        else if(BigInt(gamePlay[player==1?0:1])&temp)
        {
            bishopCoord|=temp;
            break;
        }
        bishopCoord|=temp;
    }
    return bishopCoord;
}
function pawn(player,bitboard)
{
    let pawnCoord=0b0n;
    if(player==1)
    {
        //means we have to go up
        if(!(BigInt(((gamePlay[player])|(gamePlay[player==0?1:0])))&(bitboard>>8n)))
        {
            pawnCoord|=BigInt(bitboard)>>8n;
            if((!(BigInt(((gamePlay[player])|(gamePlay[player==0?1:0])))&(bitboard>>16n)))&&(bitboard&0b11111111000000000000000000000000000000000000000000000000n))
            {
                gamePlay[3]|=BigInt(bitboard)>>8n;
                pawnCoord|=BigInt(bitboard)>>16n;
            }
        }
        if((gamePlay[player==0?1:0]&(bitboard>>7n))||((BigInt(bitboard)&0b111111110000000000000000n)))
        {
            pawnCoord|=BigInt(bitboard)>>7n;
        }
        if(gamePlay[player==0?1:0]&(bitboard>>9n))
        {
            pawnCoord|=BigInt(bitboard)>>9n;
        }
    }
    else if(player==0)
    {
        //means we have to go up
        if(!(BigInt(((gamePlay[player])|(gamePlay[player==0?1:0])))&(bitboard<<8n)))
        {
            pawnCoord|=BigInt(bitboard)<<8n;
            if((!(BigInt(((gamePlay[player])|(gamePlay[player==0?1:0])))&(bitboard<<16n)))&&(bitboard&0b0000000000000000000000000000000000000000000000001111111100000000n))
                pawnCoord|=BigInt(bitboard)<<16n;
        }
        if(gamePlay[player==0?1:0]&(bitboard<<7n))
        {
            pawnCoord|=BigInt(bitboard)<<7n;
        }
        if(gamePlay[player==0?1:0]&(bitboard<<9n))
        {
            pawnCoord|=BigInt(bitboard)<<9n;
        }
    }
    return pawnCoord;
}
function shift(bitboard,x,y)
{
    //This function will return your shifted bitboard by specified x and y
    let shiftval = x+8*(y);
    return(bitboard<<BigInt(shiftval));
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
function checkChecker() {
    let ourKing = gamer[turn*6];
    // Checking for queen or rook in the way
    if(rook(ourKing) & gamer[(turn==0?1:0)*6+2]) {
        return false;
    }

    // Checking for queen or bishop in the way
    if(bishop(ourKing) & gamer[(turn==0?1:0)*6+4]) {
        return false;
    }

    // Checking for knight in the way
    if(knight(ourKing) & gamer[(turn==0?1:0)*6+5]) {
        return false;
    }

    // Checking for pawn in the way
    if(pawn(ourKing) & gamer[(turn==0?1:0)*6+5]) {
        return false;
    }

    // Checking for king in the way
    if(king(ourKing) & gamer[(turn==0?1:0)*6]) {
        return false;
    }
}
function promotion(bitboard)
{
    //fist we check if we are dealing with pawns of some sort
    if((bitboard&gamer[11])&&(bitboard&0b11111111n))//White Pawn
    {
        gamer[11]&=~bitboard;
        gamer[7]|=bitboard;
    }
    else  if((bitboard&gamer[5])&&(bitboard&0b1111111100000000000000000000000000000000000000000000000000000000n))//Black Pawn
    {
        gamer[5]&=~bitboard;
        gamer[1]|=bitboard;
    }
}
function evaluation(bits)
{
    //Calculating the points
    let bpoints = 0;
    bpoints+=9*(countBits(bits[1])); // queens are typically worth 9 points
    bpoints+=5*(countBits(bits[2])); // rooks are typically worth 5 points
    bpoints+=3*(countBits(bits[4])); // bishops are typically worth 3 points
    bpoints+=3*(countBits(bits[3])); // knights are also typically worth 3 points
    bpoints+=1*(countBits(bits[5])); // pawns are typically worth 1 point
    
    // do the same for black pieces
    let wpoints = 0;
    wpoints+=9*(countBits(bits[7]));
    wpoints+=5*(countBits(bits[8]));
    wpoints+=3*(countBits(bits[9]));
    wpoints+=3*(countBits(bits[10]));
    wpoints+=1*(countBits(bits[11]));
    //Giving points mor weightage
    wpoints*=8;
    bpoints*=8;
    //Marking by locations
    //King
    let area = 0b1100001100000000000000000000000000000000000000000000000011000011n;
    //This is the safe king squares
    if(gamer[0]&area)
        bpoints+=4;
    else if(gamer[6]&area)
        wpoints+=4;
    area = 0b0000000000111100001111000000000000000000001111000011110000000000n;
    if(gamer[0]&area)
        bpoints-=2;
    else if(gamer[6]&area)
        wpoints-=2;
    area = 0b0000000000000000000000001111111111111111000000000000000000000000n;
    if(gamer[0]&area)
        bpoints-=5;
    else if(gamer[6]&area)
        wpoints-=5;
    //Bishops, rooks and queens
    const wstruct = gamePlay[1]&(~gamer[6]);
    const bstruct = gamePlay[0]&(~gamer[0]);
    area = 0b0000000000000000111111110000000000000000111111110000000000000000n;
    wpoints+=8*countBits(area&wstruct);
    bpoints+=8*countBits(area&bstruct);
    area = 0b0000000000000000000000000011110000111100000000000000000000000000n;
    wpoints+=10*countBits(area&wstruct);
    bpoints+=10*countBits(area&bstruct);
    //Marking by area under influence
    //We will do this for the queen, rooks, knights and bishops only
    //To make it efficient, we will merge queen with bishop and queen with rooks
    let bqb = gamer[1]|gamer[4];
    bqb = bitmapMultiplier(bqb);//Now bqp is an array
    for(let i=0;i<bqb.length;i++)
    {
        console.log(countBits(bishop(0,bqb[i])));
        bpoints+=2*countBits((bishop(0,bqb[i])));
    }
    let bqw = gamer[7]|gamer[10];
    bqw = bitmapMultiplier(bqw);
    for(let i=0;i<bqw.length;i++)
    {
        wpoints+=2*countBits((bishop(1,bqw[i])));
    }
    bqb = gamer[1]|gamer[2];
    bqb = bitmapMultiplier(bqb);//Now bqp is an array
    for(let i=0;i<bqb.length;i++)
    {
        bpoints+=2*countBits((rook(0,bqb[i])));
    }
    bqw = gamer[7]|gamer[8];
    bqw = bitmapMultiplier(bqw);
    for(let i=0;i<bqw.length;i++)
    {
        wpoints+=2*countBits((rook(1,bqw[i])));
    }
    bqb = gamer[3];
    bqb = bitmapMultiplier(bqb);//Now bqp is an array
    for(let i=0;i<bqb.length;i++)
    {
        bpoints+=2*countBits((knight(0,bqb[i])));
    }
    bqw = gamer[9];
    bqw = bitmapMultiplier(bqw);
    for(let i=0;i<bqw.length;i++)
    {
        wpoints+=2*countBits((knight(1,bqw[i])));
    }


    console.log([bpoints,wpoints])

    return [bpoints,wpoints];
}
function countBits(bitboard) {
    let count = 0;
    while (bitboard) {
        bitboard &= bitboard - 1n; // Clear the least significant bit set
        count++;
    }
    return count;
}
function computer(board,depth,alpha,beta,player)
{
    if(depth==0)
    {
        let e = evaluation(board);
        return(e[1]-e[0]);
    }
    if(player)
    {
        let maxEval = -9999999999;
        let k = allPossibleTurns(board,player)
        for(let i=0;i<k.length;i++)
        {
            let evalue = computer(k[i],depth-1,alpha,beta,0);
            maxEval = Math.max(maxEval,evalue);
            alpha = Math.max(alpha,evalue);
            if (beta <=alpha)
                break;
        }
        return maxEval;
    }
    else
    {
        let minEval = 9999999999;
        let k = allPossibleTurns(board,player)
        for(let i=0;i<k.length;i++)
        {
            let evalue = computer(k[i],depth-1,alpha,beta,1);
            minEval = Math.min(minEval,evalue);
            beta = Math.min(beta,evalue);
            if(beta<=alpha)
                break;
        }
        return minEval;
    }
}
//we need a function, which on sending a gameboard and turn will return an array of all the legal possible moves
function allPossibleTurns(board, player)
{
    if(board==undefined)
        return;
    let moves = [];
    //We have a board and whose turn it is
    //Our task is to find all the possible moves that can be played at that moment
    for(let i=0;i<6;i++)
    {
        let blis = bitmapMultiplier(board[i+6*player])
        if(blis!=undefined){
        for(let j=0;j<blis.length;j++)
        {
            let ans = whichPieceIsInvoked(player,blis[j]);
            let these = bitmapMultiplier(ans[0]);
            console.log(i);
            for(let k=0;k<these.length;k++)
            {
                let a = BigInt(board[ans[1]])&(~blis[j]);
                a|=these[k];
                let temp = ans[1];
                board[ans[1]]=a;
                moves=moves.concat([board]);
                board[ans[1]] = temp;
            }
        }
    }
    }
    return moves;
}
//Make a map multiplier
function bitmapMultiplier(bitmap)
{
    if(bitmap==undefined)
        return;
    let bitmaps = [];
    for(let i=0;i<=63;i++)
    {
        let current = 1n<<BigInt(i);
        if(current&bitmap)
        {
        bitmaps.push(current);
    }
    }
    return bitmaps;
}
//Lets implement checking in some way
function checking(moves,player)
{
    //This accepts the moves, then removes the moves that lead to check
    let allmoves = bitmapMultiplier(moves);
    
}