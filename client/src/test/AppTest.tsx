import { useEffect } from "react"
import { getGameState } from "../api/game.api"

const AppTest = () => {
    useEffect(()=>{
        getGameState().then((data)=> {
            console.log(data)
        })
    },[]);
  return (
    <>
      <div className="p-6 text-lg font-medium">
        Axios test
      </div>
    </>
  );
}

export default AppTest