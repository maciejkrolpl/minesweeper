import Board from "./components/Board";
import "./styles.css";

export default function App() {
    return (

        <div className='main'>
            <Board sizeX="10" sizeY="10" minesCount="10"/>
        </div>

    );
}
