import React, { useContext, useEffect, useRef, useState } from 'react';
import { Button } from 'react-bootstrap';
import req from '../../helpers/request';
import { ThemeContext } from '../../store/StoreProvider';
import './snake.css';

const sizePole = 25;
const widthField = 700;
const amountOfPoleX = widthField/sizePole;
const heightField = 400;
const amountOfPoleY = heightField/sizePole;
const bgColor = '#331a00';
const timeSteps = 100;
const directionStart = [0,25];

const Snake: React.FC = (): JSX.Element => {
    const [snakeBody, setSnakeBody] = useState([
        [350,150],
        [375,150]
    ]);
    const [direction, setDirection] = useState(directionStart);
    const [apple, setApple] = useState<any>([]);
    const [score, setScore] = useState<number>(0);
    const [startGameFlag, setStartGameFlag] = useState<boolean>(false);
    const [playGame, setPlayGame] = useState<boolean>(false);
    const ref = useRef(directionStart);

    const { theme } = useContext(ThemeContext);

    const applePosition = () => {
        let checkCollisionSnakeAndApple;
        do {            
            const appleX = Math.floor(Math.random() * amountOfPoleX) * sizePole;
            const appleY = Math.floor(Math.random() * amountOfPoleY) * sizePole;
            checkCollisionSnakeAndApple = snakeBody.some(pixel => pixel[0] === appleX && pixel[1] === appleY)
            setApple([appleX, appleY])
        } while (!!checkCollisionSnakeAndApple) 
    }

    const changeDirection = (e: any) => {
        switch(e.keyCode) {            
            case 38:
                if(ref.current[1] === 0){
                    setDirection([0,-25]);
                    ref.current = [0,-25];
                    break;
                }                             
                break;
            case 40:
                if(ref.current[1] === 0) {
                    setDirection([0,25]);
                    ref.current = [0,25]; 
                    break;
                }
                break;
            case 39:
                if(ref.current[0] === 0) {
                    setDirection([25,0]);
                    ref.current = [25,0];
                    break;
                }
                break;
            case 37:
                if(ref.current[0] === 0) {
                    setDirection([-25,0]);
                    ref.current = [-25,0];
                    break;
                }
                break;
            default:
                break;
        }
    }

    const startGame = () => {
        setPlayGame(true);
        setSnakeBody([[350,150],[375,150]]);
        setDirection(directionStart); 
        setScore(0);
        ref.current = directionStart;
        setStartGameFlag(prev => !prev);        
    }

    const gameOver = async (): Promise<void> => {
        setDirection([]);
        setPlayGame(false);
        await req.post('game', {
            name: 'snake',
            numberPoints: score
        });
    }

    const checkCollisionWithBorder = (head: Number[]) => {
        if(head[0] >= widthField || head[0] < 0 || head[1] < 0 || head[1] >= heightField) {
            return false;
        }
        return true;
    }

    const checkCollisionWithBody = () => {
        const snake = [...snakeBody];
        let head = snake[snake.length - 1];
        let check: boolean = true;
        snake.pop()
        snake.forEach((pixel: Number[]) => {
           if(head[0] === pixel[0] && head[1] === pixel[1]) {
                check = false;
           }
        })
        return check;
    }

    const appleEaten = (head: Number[]) => {
        if(head[0] === apple[0] && head[1] === apple[1]) {
            applePosition();
            setScore(prev => prev + 1);
            return true;
        }
        return false;
    }

    const motionSnake = () => {
        if(playGame) {
            let positionsSnake = [...snakeBody];
            let head = positionsSnake[positionsSnake.length - 1];
    
            head = [head[0] + direction[0], head[1] + direction[1]];
            positionsSnake.push(head);
            if(!appleEaten(head)) {
                positionsSnake.shift();
            }
            
            if(checkCollisionWithBorder(head) && checkCollisionWithBody()) {
                setSnakeBody(positionsSnake);
            } else {
                gameOver();
            }
        }        
    }

    useEffect(()=>{
        applePosition();
        document.addEventListener('keydown', changeDirection);
        return () => {
            document.removeEventListener("keydown", changeDirection);
        };
    },[startGameFlag])

    useEffect(()=>{
        const a = setInterval(()=>{
            motionSnake()
        }, timeSteps);
        return () => clearInterval(a);
    }, [direction, snakeBody]);

    const appleFood = <div className='apple' style={{left:`${apple[0]}px`, top:`${apple[1]}px`}}></div>

    return (
        <div className='d-flex justify-content-center mt-5 flex-column'>
            <p className={theme.textColor}>Zdobyte punkty: {score}</p>
            <div className='container-snake' onKeyDown={(e) => changeDirection(e)} style={{minWidth: `${widthField}px`, height:`${heightField}px`, backgroundColor:bgColor}}>
                {snakeBody.map((field: any, i: any) => {
                    return <div key={i} className='snake' style={{left:`${field[0]}px`, top:`${field[1]}px`}}></div>
                })}
                {appleFood}
                {!playGame &&
                    <div className='modal-snake'>
                        <div className='snake-info'>
                            {score > 0 ? <p>Wynik: {score}</p> : null}
                            <p>Rozpocznij nową grę</p>
                            <Button onClick={startGame} variant='danger'>Start</Button>
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}

export default Snake;
