
class PongGame
{
    constructor()
    {
        this.canvas = document.getElementById("game");
        this.ctx = this.canvas.getContext("2d"); 
        document.addEventListener('keydown', this.onKeyPress.bind(this));
        document.addEventListener('keyup', this.onKeyUp.bind(this));

        this.balls = [];
        this.players = [];
        this.ball;
        this.player;
        this.time;
        this.startTime;
        this.CANVAS_WIDTH = 800;
        this.CANVAS_HEIGHT = 600;
        this.GameStarted = false;
        this.newBallSpawned = false;
       
    }


    init(){                    

        if(!this.GameStarted)
        {
            this.players = [];
            this.FPS = 60;
            
            //PLAYER
            this.player = new Player(this.ctx,this);
            this.player.x = 10;
            this.player.y  = this.CANVAS_HEIGHT/2-this.player.h;
            this.player.name = "SERCAN";

            //AI
            this.ai = new Player(this.ctx,this);
            this.ai.x = this.CANVAS_WIDTH-50;
            this.ai.y = 100;
            this.ai.name = "AI";
            //

            this.players.push(this.player,this.ai);

            //GAME SETTINGS 
            this.timer = setInterval(this.loop.bind(this),1000/this.FPS);
            this.balls = [];
            this.startTime = Date.now();
            this.GenerateBall(1);
            this.GameStarted = true;  
            this.newBallSpawned = false;
            //
            this.AI_Manager();  
            
        }

    }

    AI_Manager()
    { 
        var tempx = this.ball.x;
        if(this.ai.x<=this.ball.x+this.ball.r  && this.ball.y >= this.ai.y && this.ball.y <= this.ai.y+this.ai.h)
        {
            
            this.ball.velocityX*=-1;
        }
        
        //COLLISION
        if(this.ai.y<0 )
             this.ai.velocityY =10;
    else if( this.ai.y+this.ai.h > this.CANVAS_HEIGHT )
            this.ai.velocityY =10;

        setTimeout(this.AI_Movement.bind(this, tempx),100);

         


    }

    AI_Movement(tempx,mode)
    {
        
        if(this.ball.x>tempx  )//BALL IS COMING
        {
               if(this.ai.y+this.ai.h/2 + Math.random()*35 >this.ball.y)
                    this.ai.velocityY = -10;
                else if(this.ai.y+this.ai.h/2<this.ball.y)
                    this.ai.velocityY = 10;
        }
       else if(Math.abs(this.ai.y - this.player.y) >= 50)
            {
                
             if(this.ai.y>this.player.y)
                this.ai.velocityY =-10;
             else
                this.ai.velocityY = 10;
            }
        else
            this.ai.velocityY=0;


            
        this.ai.y+=this.ai.velocityY;


    }




    GenerateBall(count)
    {
        for(var i=0;i<count;i++)
        {

            this.ball = new Ball(this.ctx,this);
            this.ball.x = Math.random()*400+30;  
            this.ball.y =  Math.random()*400+30;
         
            this.ball.velocityX = 10;
            this.ball.velocityY = 10;
            this.ball.r = 15;
            this.balls.push(this.ball);
        }

    }

    reset()
    {

        this.GameStarted = false;
        clearInterval(this.timer);
        setTimeout(this.init.bind(this),3000);
         
      
        
    }



    loop()
    {
        this.update();
        this.draw();
        this.AI_Manager();
    }


    update()
    {
        for(var i=0;i<this.balls.length;i++)
        {
            this.balls[i].update();
        }
        this.player.update(); 

 
    }


    draw()  
    {
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0,0,this.CANVAS_WIDTH,this.CANVAS_HEIGHT);
        if(!this.GameStarted)//GAME OVER TEXT
            {
                this.ctx.fillStyle = "red";
                this.ctx.font = "40px Verdana";
                this.ctx.textAlign = "center";
                this.ctx.fillText("Game OVER :(", this.CANVAS_WIDTH/2,this.CANVAS_HEIGHT/2);
            }

            //SCORE
        this.ctx.fillStyle = "red";
        this.ctx.font = "40px Verdana";
        this.ctx.textAlign = "left";
        this.ctx.fillText( this.time = Math.floor((Date.now() - this.startTime) / 1000).toString(),0,this.CANVAS_HEIGHT-5);
        
        for(var i=0;i<this.balls.length;i++)
        {
            this.balls[i].draw();
        }


        for(i=0;i<this.players.length;i++)
        {
            this.players[i].draw();
        }

    }

    onKeyPress(e)
    {
        
        if (e.keyCode === 87) {//UP
            this.player.velocityY= -10;
    
        }
        else if (e.keyCode === 83 ) {//DOWN
        
            this.player.velocityY = 10;
        }

    
    }

    onKeyUp(e)
    {

        
        if (e.keyCode === 87 ) {//UP
            this.player.velocityY = 0;
            this.player.accY = 0;
        }
        else if (e.keyCode === 83 ) {//DOWN
            this.player.accY = 0;
            this.player.velocityY=0; 
        }

    
    }


    
}




class Ball{
    constructor(ctx,game)
    {
        this.ctx = ctx;
        this.game = game;
        this.x;
        this.y;
        this.velocityX;
        this.velocityY;
        this.r;
          
    }


    draw()
    {
        this.ctx.fillStyle = "green";
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
        this.ctx.closePath();
        this.ctx.fill();
    }

    update()
    {
    
        if(this.x+this.r>=game.CANVAS_WIDTH)
            this.velocityX*=-1;
        if(this.y+this.r>=game.CANVAS_HEIGHT || this.y-this.r<=0)
            this.velocityY*=-1;


        //BALL COLLISION CHECK
         if(this.x <= game.player.x + game.player.w + this.r && (this.y>=game.player.y && this.y<=game.player.y +game.player.h ))
             {
                  this.velocityX*=-1;
                  
             }


        if(this.x-this.r<=game.player.x+game.player.w/2 && (this.y+this.r>=game.player.y || this.y-this.r<=game.player.y+game.player.h))
             game.reset();

        if(this.x+this.r>=game.ai.x+game.ai.w/2 && (this.y+this.r>=game.ai.y || this.y-this.r<=game.ai.y+game.ai.h ))
             game.reset();
        
         


    if(this.x-this.r<=0 || this.x+this.r>=game.CANVAS_WIDTH)
     {
      game.reset();
    }
        
        this.x+=this.velocityX;  
        this.y+=this.velocityY;


        
    }
}//class ball end


class Player
{
    constructor(ctx,game)
    {
        this.ctx = ctx;
        this.x;
        this.h = 100;
        this.y ;
        this.w = 30;
        this.accY=0;
        this.velocityY=0;
        this.name;

    }


    update()
    {
    

        if(this.y<=0  && (this.velocityY<0) )
        {
            this.velocityY = 0;
            this.accY = 0;
        }
        
        if(this.y+this.h>=game.CANVAS_HEIGHT && (this.velocityY>0))
            {
               this.accY = 0;
                this.velocityY = 0;
            }

        if(this.velocityY!=0 )
        {
            this.velocityY/2 > 0 ? this.accY += 0.1 : this.accY-=0.1;

            this.y += this.velocityY+this.accY;     
        }

    }

    draw()
    {
        if(this.name == "AI")
            this.ctx.fillStyle = "blue";
        else
            this.ctx.fillStyle = "red";
        this.ctx.fillRect(this.x,this.y,this.w,this.h);

        this.ctx.font = "10px Comic Sans MS";
        this.ctx.textAlign = "center";
        this.ctx.fillStyle = "white";
        this.ctx.fillText(this.name, this.x+15,this.y+this.h+10);
    }


}



// Yeni oyun oluştur:
const game = new PongGame();
  
// Sayfa yüklendiğinde oyunu oynanabilir hale getir:
window.onload = () => game.init();
