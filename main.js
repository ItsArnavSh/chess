
    document.addEventListener("DOMContentLoaded",()=>{
    //main
    setElements();
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
    //Functions
    function setElements()
    {
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

            board.appendChild(box);
        }
    }
    
    };
    //Making objects
    //Movement notation
    /*
        updown,leftright,diag,alive,max
    */
    ///////
    });