//setting the global variables
let turn=1//1 means white and 0 means black
let gamer,k=[],chosen=null;
let keys;//To select all the boxes
//This function will trigger when DOM is loaded
document.addEventListener("DOMContentLoaded",()=>{
    makeBoxes();
    hello();
});


//To make the chess squares
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
    return gamer;
    };
function Creator(type,team,image,sno)
    {
        this.type = type;
        this.team = team;
        this.img = image
        this.alive = 1;
        this.sno = sno;
        this.move = 0;
        //team 0 for black,1 for white
        //id = index no of the piece, like there are 8 pawns, so which one?
    }
function initializeBoxes()
    {
    //0 for king
    //1 for queen
    //2 for rook
    //3 for knight
    //4 for bishop
    //5 for pawn
    gamer.a8 = new Creator(2, 0, "pieces/rook-b.svg", 0);
    gamer.b8 = new Creator(3, 0, "pieces/knight-b.svg", 1);
    gamer.c8 = new Creator(4, 0, "pieces/bishop-b.svg", 2);
    gamer.d8 = new Creator(1, 0, "pieces/queen-b.svg", 3);
    gamer.e8 = new Creator(0, 0, "pieces/king-b.svg", 4);
    gamer.f8 = new Creator(4, 0, "pieces/bishop-b.svg", 5);
    gamer.g8 = new Creator(3, 0, "pieces/knight-b.svg", 6);
    gamer.h8 = new Creator(2, 0, "pieces/rook-b.svg", 7);
    for (let i = 0; i < 8; i++) {
        gamer[String.fromCharCode(97 + i) + '7'] = new Creator(5, 0, "pieces/pawn-b.svg", 8 + i);
    }
    
    // Initialize white pieces
    gamer.a1 = new Creator(2, 1, "pieces/rook-w.svg", 16);
    gamer.b1 = new Creator(3, 1, "pieces/knight-w.svg", 17);
    gamer.c1 = new Creator(4, 1, "pieces/bishop-w.svg", 18);
    gamer.d1 = new Creator(1, 1, "pieces/queen-w.svg", 19);
    gamer.e1 = new Creator(0, 1, "pieces/king-w.svg", 20);
    gamer.f1 = new Creator(4, 1, "pieces/bishop-w.svg", 21);
    gamer.g1 = new Creator(3, 1, "pieces/knight-w.svg", 22);
    gamer.h1 = new Creator(2, 1, "pieces/rook-w.svg", 23);
    for (let i = 0; i < 8; i++) {
        gamer[String.fromCharCode(97 + i) + '2'] = new Creator(5, 1, "pieces/pawn-w.svg", 24 + i);
    }
    }
function display()
{
    for(let i = 0;i<keys.length;i++)
{
    if(gamer[keys[i].id]!=null && !keys[i].querySelector('img'))
    {
        const img = document.createElement("img");
        img.src = gamer[keys[i].id].img;
        img.height = 43;
        img.style.backgroundColor = 'transparent';
        img.style.pointerEvents = 'none';
        keys[i].appendChild(img);
    }
    else if(gamer[keys[i].id]!=null && keys[i].querySelector('img'))
    {
        continue;
    }
    else
    { 
    
        if(keys[i].querySelector('img'))
        {
            let img = keys[i].querySelector('img');
            keys[i].removeChild(img);
        }
        
    }}
}
//removes paths
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
function checkOccupied(block)
{
    if(gamer[block]!=null)
        return true;
    return false;
}
//function to change the coordinate
function changeCoord(piece,x,y)
{
    return `${String.fromCharCode(piece.charCodeAt(0)+x)}${parseInt(piece[1],10)+y}`;
}
function moves(piece)
{
    switch(gamer[piece].type)
    {
        case 0:
            return king(piece);
        case 1:
            return queen(piece);
        case 2:
            return rook(piece);
        case 3:
            return knight(piece);
        case 4:
            return bishop(piece);
        case 5:
            return pawn(piece);
    }   
}
function king(piece)
{
let moves = [];
let checkThese = [[-1,1],[0,1],[1,1],[1,0],[1,-1],[0,-1],[-1,-1],[-1,0]];
for(var i = 0;i<checkThese.length;i++)
{
    var pi = changeCoord(piece,checkThese[i][0],checkThese[i][1]);
    if(pi in gamer)
    {
        if(!checkOccupied(pi))
        moves.push(pi);
        else if(gamer[pi].team!=turn)
            {
                moves.push(pi);
            }
    }
}
//Checking if castle is possible
if(gamer[piece].move==0)
{
    let c1 = [changeCoord(piece,1,0),changeCoord(piece,2,0)]
    if(gamer[changeCoord(piece,1,0)]==null && gamer[changeCoord(piece,2,0)]==null && gamer[changeCoord(piece,3,0)].move==0)
    {
        if(checkForCheck(c1,piece).length==2)
            moves.push(changeCoord(piece,2,0));
    }
    c1 = [changeCoord(piece,-1,0),changeCoord(piece,-2,0),changeCoord(piece,-3,0)];
    if(gamer[changeCoord(piece,-1,0)]==null && gamer[changeCoord(piece,-2,0)]==null && gamer[changeCoord(piece,-3,0)]==null && gamer[changeCoord(piece,-4,0)].move==0)
    {
        if(checkForCheck(c1,piece).length==3)
            moves.push(changeCoord(piece,-2,0));
    }

}

return moves;
}
function queen(piece)
{
let moves = [];

moves = bishop(piece);
moves = moves.concat(rook(piece));
return moves;
}
function rook(piece)
{
let moves = [];
let pi=piece;
//up
while(true)
{
    pi = changeCoord(pi,0,1);
    if(parseInt(pi[1],10)<=8)
    {
        if(gamer[pi]==null)
            moves.push(pi);
        else
        {
            if(gamer[pi].team!=turn)
            {
                moves.push(pi);
            }
            break;
        } 
    }
    else
        break;
}
pi = piece;
while(true)
{
    pi = changeCoord(pi,0,-1);
    if(parseInt(pi[1],10)>=1)
    {
        if(gamer[pi]==null)
            moves.push(pi);
        else
        {
            if(gamer[pi].team!=turn)
            {
                moves.push(pi);
            }
            break;
        } 
    }
    else
        break;
}
//across
pi = piece;
while(true)
{
    pi = changeCoord(pi,1,0);
    if(pi[0].charCodeAt(0)-96<=8)
    {
        if(gamer[pi]==null)
            moves.push(pi);
        else
        {
            if(gamer[pi].team!=turn)
            {
                moves.push(pi);
            }
            break;
        } 
    }
    else
        break;
}
pi = piece;
while(true)
{
    pi = changeCoord(pi,-1,0);
    if(pi[0].charCodeAt(0)-96>=1)
    {
        if(gamer[pi]==null)
            moves.push(pi);
        else
        {
            if(gamer[pi].team!=turn)
            {
                moves.push(pi);
            }
            break;
        } 
    }
    else
        break;
}
return moves;
}
function knight(piece)
{
let moves = [];
//permutations of 2,1,-2,-1
//2,1|-2,1|2,-1|-2,-1|1,2|-1,2|-1,2|-1,-2
let checkThese = [[2,1],[-2,1],[2,-1],[-2,-1],[1,2],[-1,2],[1,-2],[-1,-2]];
for(var i = 0;i<checkThese.length;i++)
{
    var pi = changeCoord(piece,checkThese[i][0],checkThese[i][1]);
    if(pi in gamer)
    {
        if(!checkOccupied(pi))
        moves.push(pi);
        else if(gamer[pi].team!=turn)
            {
                moves.push(pi);
            }
    }
}
return moves;
}
function bishop(piece)
{
let moves = [];
let pi=piece;
//up
while(true)
{
    pi = changeCoord(pi,1,1);
    if(parseInt(pi[1],10)<=8 && pi[0].charCodeAt(0)-96<=8)//checked
    {
        if(gamer[pi]==null)
            moves.push(pi);
        else
        {
            if(gamer[pi].team!=turn)
            {
                moves.push(pi);
            }
            break;
        } 
    }
    else
        break;
}
pi = piece;
while(true)
{
    pi = changeCoord(pi,1,-1);
    if(parseInt(pi[1],10)>=1 && pi[0].charCodeAt(0)-96<=8)//checked
    {
        if(gamer[pi]==null)
            moves.push(pi);
        else
        {
            if(gamer[pi].team!=turn)
            {
                moves.push(pi);
            }
            break;
        } 
    }
    else
        break;
}
//across
pi = piece;
while(true)
{
    pi = changeCoord(pi,-1,1);
    if(pi[0].charCodeAt(0)-96>=1 && parseInt(pi[1],10)<=8)//checked
    {
        if(gamer[pi]==null)
            moves.push(pi);
        else
        {
            if(gamer[pi].team!=turn)
            {
                moves.push(pi);
            }
            break;
        } 
    }
    else
        break;
}
pi = piece;
while(true)
{
    pi = changeCoord(pi,-1,-1);
    if(pi[0].charCodeAt(0)-96>=1 && parseInt(pi[1],10)>=1)
    {
        if(gamer[pi]==null)
            moves.push(pi);
        else
        {
            if(gamer[pi].team!=turn)
            {
                moves.push(pi);
            }
            break;
        } 
    }
    else
        break;
}
return moves;
}
function pawn(piece)
{
let direction;
if(gamer[piece].team==1)
direction=1;
else
direction=-1;
let possible;
let moves = [];
possible = `${piece[0]}${parseInt(piece[1],10)+direction}`;
if(!checkOccupied(possible))
{
    moves.push(possible);
if((piece[1]==2 && gamer[piece].team==1) || (piece[1]==7&& gamer[piece].team==0))
{
    possible = `${piece[0]}${parseInt(piece[1],10)+2*direction}`;
    if(!checkOccupied(possible))
        moves.push(possible);
}}
//checking left attack
let left = `${String.fromCharCode(piece.charCodeAt(0)-1)}${parseInt(piece[1],10)+direction}`;
if(piece[0]!='a' && checkOccupied(left) && turn!=gamer[left].team)
    moves.push(left);
//right attack
let right = `${String.fromCharCode(piece.charCodeAt(0)+1)}${parseInt(piece[1],10)+direction}`
if(piece[0]!='h'  && checkOccupied(right) && turn!=gamer[right].team)
    moves.push(right);
return moves;
}
function checkForCheck(k,key)
{
    let nk=[];
    //k is the array of moves
    //key is the positioncheckFor
    for(let a=0;a<k.length;a++)
    {
        let c = false;
        //We assume the move k[a] has been made
        //We will revert it back later
        let temp = gamer[k[a]];
        gamer[k[a]]=gamer[key];
        gamer[key]=null;

        //Now, we will see if making that move puts our king in danger
        turn=!turn;
        for(let i=8;i>=1;i--)
        {
            for(let j='a'.charCodeAt(0);j<='h'.charCodeAt(0);j++)
            {
                let toCheck = (`${String.fromCharCode(j)}${i}`);
                if(gamer[toCheck]!=null&&gamer[toCheck].team==turn)
                {
                    let ans = moves(toCheck);
                    lop:
                    for(let l = 0;l<ans.length;l++)
                    {
                        if(gamer[ans[l]]!=null&&gamer[ans[l]].type===0 && gamer[ans[l]].team!=turn)
                        {
                            c=true;
                            break lop;
                        }
                    }
                }
            }
        }
        if(c==false)
        {
            nk.push(k[a]);
        }
        //Reverting back
        turn=!turn;
        gamer[key] = gamer[k[a]];
        gamer[k[a]]=temp;
    }
    return(nk);
}
function run(target )
{
    //whenever a key is pressed
    clear();
    const key = target.getAttribute("id");
    if(k.includes(key)&& chosen!=key)
{
    if(gamer[key]!=null)
    {
        const ke = document.querySelector(`#${key}`);
        let img = ke.querySelector('img');
        ke.removeChild(img);
    }
    if(gamer[key]==null)
        playMoveSound();
    else
        playCaptureSound();
    gamer[key] = gamer[chosen];
    gamer[chosen] = null;
    gamer[key].move++;
    turn=!turn;
    if((parseInt(key[1],10)==8&&gamer[key].team==1 && gamer[key].type==5))
    {
        gamer[key]=new Creator(1,1,"pieces/queen-w.svg");
    }
    if((gamer[key].type==5&&parseInt(key[1],10)==1)&&gamer[key].team==0)
        gamer[key]=new Creator(1,0,"pieces/queen-b.svg");
    k=[];
    //castle
    if(gamer[key].type==0 && gamer[key].move==1 && (key[0]=='g' ||key[0]=='c'))
    {
        if(key[0]=='g')//kingside
        {
            gamer[`f${key[1]}`]=gamer[`h${key[1]}`]
            gamer[`h${key[1]}`]=null;
        }
        else//queenside
        {
            gamer[`d${key[1]}`]=gamer[`a${key[1]}`]
            gamer[`a${key[1]}`]=null;
        }
    }
    display();
}
else
{
    k = [];
}
if(gamer[key]!=null)
{
    chosen = key;
if(gamer[key].team==turn)
    {
        //Aha, the earliest instance of moves, where key contains the index
        //Perfect
        k = moves(key);
        //The object chosen is at key currently and k is all posibble motions
        k = checkForCheck(k,key);
        for(let j=0;j<k.length;j++)
        {
            let change = document.getElementById(k[j]);
            if(checkOccupied(k[j]))
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
            if((k[j].charCodeAt(0)+parseInt(k[j][1],10))%2==0)
            {
                indicator.style.filter = 'brightness(500%)';
                indicator.style.opacity = '0.2';
            }
            //piece.charCodeAt(0)+x)}${parseInt(piece[1],10)+y
            indicator.style.opacity = '0.2';
            change.appendChild(indicator);
            }
        }
        //Checking if any move is possible for the other side
        //turn=!turn;
        let s=[],t=false;
        //Every possible move
        for(let i=8;i>=1;i--)
        {
        for(let j='a'.charCodeAt(0);j<='h'.charCodeAt(0);j++)
        {
            let toCheck = (`${String.fromCharCode(j)}${i}`);
            if(gamer[toCheck]!=null && gamer[toCheck].team==turn)
                s.push(toCheck);
        }}
        //s contains every character
        //Every possible legal move
        let as=[];
        for(let asd = 0;asd<s.length;asd++)
        {
            as=checkForCheck(moves(s[asd]),s[asd]);
            if(as.length!=0)
            {
                t=true;
            }   
        }
        
        if(t==false)
        {
            if(turn==1)
                whoWin("Black");
            else
                whoWin("White");
        }
        //turn=!turn;
}
}
}
function hello() {
    //This will start the game
    const board = document.getElementById("board");

    const play = document.createElement("button");
    play.classList.add("Play");
    play.textContent = "Play";
    board.appendChild(play);

    const about = document.createElement("button"); // Create a new button
    about.classList.add("About"); // Add the class "About" to the button
    about.textContent = "About"; // Set the button's text to "About"
    about.addEventListener('click', () => {
        window.location.href = 'https://itsarnavsh.github.io/'; // Redirect to the specified URL
    });
    board.appendChild(about); // Append the button to the board

    const startGame = () => {
        console.log("Hello");
        board.innerHTML = ''; // Clear the board
        game();
        board.removeEventListener('click', startGame); // Remove the event listener
    };
    play.addEventListener('click', startGame); // Add event listener to the "Play" button
}
function game()
{
    gamer=makeBoxes();
    keys = document.querySelectorAll(".box");
    initializeBoxes();
    display();
    //Now The Actual Game
    for(let i = 0;i<keys.length;i++)
    {
        keys[i].onclick = ({target})=>{run(target);}}
}
function playMoveSound() {
    const audio = new Audio('pieces/move.mp3'); // Create a new Audio object
    audio.play(); // Play the audio file
}
function playCaptureSound() {
    const audio = new Audio('pieces/capture.mp3'); // Create a new Audio object
    audio.play(); // Play the audio file
}
function whoWin(team)
{
    const board = document.getElementById("board");
    board.innerHTML = ''; // Clear the board
    makeBoxes();
    const winner = document.createElement("h1");
    winner.classList.add("victoryScreen");
    winner.textContent = `${team} Won`;
    board.appendChild(winner);
    const again = document.createElement("button");
    again.classList.add("About");
    again.textContent = "Play Again";
    again.addEventListener('click', () => {
        window.location.href = 'https://itsarnavsh.github.io/chess'; // Technically Refresh
    });
    board.appendChild(again);
}