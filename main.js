
    document.addEventListener("DOMContentLoaded",()=>{
    //main
    let gamer = setElements();
    console.log(gamer);
    //Marking the buttons
    const keys = document.querySelectorAll(".box");
    for(let i = 0;i<keys.length;i++)
    {
        keys[i].onclick = ({target})=>{
        const key = target.getAttribute("id");
        console.log(key);
        };
    }
    //Making a constructor function for the pieces
    //0 for king
    //1 for queen
    //2 for rook
    //3 for knight
    //4 for bishop
    //5 for pawn
    let wk1 = new Creator(0,1,"pieces/king-w");
    gamer.e1 = wk1;
    let wq1 = new Creator(1,1,"pieces/queen-w");
    gamer.d1 = wq1;
    let wr1 = new Creator(2,1,"pieces/rook-w");
    gamer.a1 = wr1;
    gamer.h1 = wr1;
    let wb1 = new Creator(4,1,"pieces/bishop-w");
    gamer.c1 = wb1;
    gamer.f1 = wb1;
    let wn1 = new Creator(3,1,"pieces/knight-w");
    gamer.b1 = wn1;
    gamer.g1 = wn1;
    let wp1 = new Creator(5,1,"pieces/pawn-w");
    gamer.a2 = wp1;
    gamer.b2 = wp1;
    gamer.c2 = wp1;
    gamer.d2 = wp1;
    gamer.e2 = wp1;
    gamer.f2 = wp1;
    gamer.g2 = wp1;
    gamer.h2 = wp1;
    let bk1 = new Creator(0,0,"pieces/king-b");
    gamer.e8 = bk1;
    let bq1 = new Creator(1,0,"pieces/queen-b");
    gamer.d8 = bq1;
    let br1 = new Creator(2,0,"pieces/rook-b");
    gamer.a8 = br1;
    gamer.h8 = br1;
    let bb1 = new Creator(4,0,"pieces/bishop-b");
    gamer.c8 = bb1;
    gamer.f8 = bb1;
    let bn1 = new Creator(3,0,"pieces/knight-b");
    gamer.b8 = bn1;
    gamer.g8 = bn1;
    let bp1 = new Creator(5,0,"pieces/pawn-b");
    gamer.a7 = bp1;
    gamer.b7 = bp1;
    gamer.c7 = bp1;
    gamer.d7 = bp1;
    gamer.e7 = bp1;
    gamer.f7 = bp1;
    gamer.g7 = bp1;
    gamer.h7 = bp1;
    console.log(gamer);
    //Functions
    //Function to make objects for pieces
    function Creator(type,team,image)
    {
        this.type = type;
        this.team = team;
        this.img = image
        this.alive = 1;
        //type 0,1,2,3,4,5,6 for king,queen,pawn,knight,bishop,rook
        //team 0 for black,1 for white
        //id = index no of the piece, like there are 8 pawns, so which one?
    }
    //To make an empty 2d array
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