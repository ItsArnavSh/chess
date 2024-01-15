
    document.addEventListener("DOMContentLoaded",()=>{
    //main
    let turn = 1;// 1 means white and 0 means black     
    let gamer = setElements();
    console.log(gamer);
    //Marking the buttons
    const keys = document.querySelectorAll(".box");
    for(let i = 0;i<keys.length;i++)
    {
        keys[i].onclick = ({target})=>{
        const key = target.getAttribute("id");
        };
    }
    //Making a constructor function for the pieces
    //0 for king
    //1 for queen
    //2 for rook
    //3 for knight
    //4 for bishop
    //5 for pawn
    gamer.e1 = new Creator(0,1,"pieces/king-w.svg");
    let wq1 = new Creator(1,1,"pieces/queen-w.svg");
    gamer.d1 = wq1;
    let wr1 = new Creator(2,1,"pieces/rook-w.svg");
    gamer.e5 = wr1;
    gamer.h1 = wr1;
    let wb1 = new Creator(4,1,"pieces/bishop-w.svg");
    gamer.d4 = wb1;
    gamer.f1 = wb1;
    let wn1 = new Creator(3,1,"pieces/knight-w.svg");
    gamer.b1 = wn1;
    gamer.g1 = wn1;
    let wp1 = new Creator(5,1,"pieces/pawn-w.svg");
    gamer.b2 = wp1;
    gamer.c3 = wp1;
    gamer.c2 = wp1;
    gamer.d2 = wp1;
    gamer.e2 = wp1;
    gamer.f2 = wp1;
    gamer.g2 = wp1;
    gamer.h2 = wp1;
    let bk1 = new Creator(0,0,"pieces/king-b.svg");
    gamer.e8 = bk1;
    let bq1 = new Creator(1,0,"pieces/queen-b.svg");
    gamer.d8 = bq1;
    let br1 = new Creator(2,0,"pieces/rook-b.svg");
    gamer.a8 = br1;
    gamer.h8 = br1;
    let bb1 = new Creator(4,0,"pieces/bishop-b.svg");
    gamer.c8 = bb1;
    gamer.f8 = bb1;
    let bn1 = new Creator(3,0,"pieces/knight-b.svg");
    gamer.b8 = bn1;
    gamer.g8 = bn1;
    let bp1 = new Creator(5,0,"pieces/pawn-b.svg");
    gamer.a7 = bp1;
    gamer.b7 = bp1;
    gamer.c7 = bp1;
    gamer.d7 = bp1;
    gamer.e3 = bp1;
    gamer.f7 = bp1;
    gamer.g7 = bp1;
    gamer.h7 = bp1;
    console.log(gamer);
    //Display the pieces
    for(let i = 0;i<keys.length;i++)
    {
        if(gamer[keys[i].id]!=null)
        {
            const img = document.createElement("img");
            img.src = gamer[keys[i].id].img;
            img.height = 55;
            img.style.backgroundColor = 'transparent';
            img.style.pointerEvents = 'none';
            keys[i].appendChild(img);
        }
    }
    for(let i = 0;i<keys.length;i++)
    {
        keys[i].onclick = ({target})=>{
        const key = target.getAttribute("id");
        clear();
        if(gamer[key]!=null)
        {
        if(gamer[key].team===turn)
            {
                const k = moves(key);
                console.log(k);
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
                    indicator.style.opacity = '0.5';
                    
                    change.appendChild(indicator);
                    }
                }

            }
        else
        {
            console.log("nope");    
        }
    }
        };
    }
    //Functions
    //Function to make objects for pieces
    function Creator(type,team,image)
    {
        this.type = type;
        this.team = team;
        this.img = image
        this.alive = 1;
        //team 0 for black,1 for white
        //id = index no of the piece, like there are 8 pawns, so which one?
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
    
    function checkOccupied(block)
    {
        if(gamer[block]!=null)
            return true;
        return false;
    }
    //To determine moves
    function moves(piece)
    {
        //piece is the string of current block we are in
        if(gamer[piece].type==5)
        {
            return(pawn(piece));
        }
        else if(gamer[piece].type===2)
        {
            return(rook(piece));
        }
        else if(gamer[piece].type===4)
        {
            return(bishop(piece));
        }
        //we will make functions that return what each function will do
        //moves is the list of all the possible moves
    }
    function king(piece)
    {
        let moves = [];

        return moves;
    }
    function queen(piece)
    {
        let moves = [];

        return moves;
    }
    function rook(piece)
    {
        let moves = [];
        let pi=piece;
        console.log(pi);
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

        return moves;
    }
    function bishop(piece)
    {
        let moves = [];
        let pi=piece;
        console.log(pi);
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
    function pawn(piece)
    {
        let possible;
        let moves = [];
        possible = `${piece[0]}${parseInt(piece[1],10)+1}`;
        if(!checkOccupied(possible))
        {
            moves.push(possible);
        if(piece[1]==2)
        {
            possible = `${piece[0]}${parseInt(piece[1],10)+2}`;
            if(!checkOccupied(possible))
                moves.push(possible);
        }}
        //checking left attack
        let left = `${String.fromCharCode(piece.charCodeAt(0)-1)}${parseInt(piece[1],10)+1}`;
        if(piece[0]!='a' && checkOccupied(left) && turn!=gamer[left].team)
            moves.push(left);
        //right attack
        let right = `${String.fromCharCode(piece.charCodeAt(0)+1)}${parseInt(piece[1],10)+1}`
        if(piece[0]!='h'  && checkOccupied(right) && turn!=gamer[right].team)
            moves.push(right);
        return moves;
    }
    //function to change the coordinate
    function changeCoord(piece,x,y)
    {
        return `${String.fromCharCode(piece.charCodeAt(0)+x)}${parseInt(piece[1],10)+y}`;
    }
    //To set the board      
    function setElements()
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
    //Making objects
    //Movement notation
    /*
        updown,leftright,diag,alive,max
    */
    ///////
    });