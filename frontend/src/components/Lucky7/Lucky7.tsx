// React
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../reducers";
// MUI
import { Grid, Typography } from "@mui/material";
// Sockets
import { getSocket } from '../../socket';
// Components
import Wager from "./Wager";
import RollsDisplay from "./RollsDisplay";
// Types
import { LiveRolls, Lucky7Response } from "../../types";
import { Lucky7Props } from "../../types/props";
// API
import { startLucky7 } from "../../api";


const renderReponse = (response: Lucky7Response) => {
  if(response?.payout){
    return <Typography>Congratulations!</Typography>
  }
  if(isValidErrorMessage(String(response?.message ?? ""))){
    return <Typography>{response?.message}</Typography>
  }
  return <Typography>Wager is live...</Typography>
}

const isValidErrorMessage = (msg: string) => {
  if(!msg?.length){
    return false;
  }
  const sanitizedMessage = String(msg ?? "").toLocaleLowerCase();
  return sanitizedMessage !== "undefined";
}

const getLucky7RollsToDisplay = (rolls: LiveRolls[]) => {
  const usedTimeStamps : number[] = [];
  const rollsDisplay : LiveRolls[] = [];
  for(let i = 0; i < rolls.length; i++){
    if(!usedTimeStamps.includes(rolls[i].timestamp)) {
      usedTimeStamps.push(rolls[i].timestamp);
      rollsDisplay.push(rolls[i]);
    }
  }
  while(rollsDisplay.length > 5) {
    rollsDisplay.pop();
  }
  return rollsDisplay;
}

const Lucky7: React.FC<Lucky7Props> = (props) => {

    const socket = getSocket();

    const [diceRolls, setDiceRolls] = useState([] as LiveRolls[]);
    const [response, setResponse] = useState<Lucky7Response | undefined>(undefined);

    const playLucky7Callback = async (response: Lucky7Response) => {
      setResponse(response);
    }

    const { user } = props;
  
    useEffect(() => {
  
      function onNewLucky7Roll(value: LiveRolls[]) {
        setResponse(undefined);
        setDiceRolls(previous => getLucky7RollsToDisplay(value));
      }

      async function rollInitialDice() {
        const rolls = (await startLucky7({ email: user.email }))?.data?.rolls ?? [] as LiveRolls[];
        if(rolls){
          setDiceRolls(rolls);
        }
      }

      if(diceRolls.length < 5) {
        rollInitialDice();
      }
  
      socket?.on?.('lucky7Socket', onNewLucky7Roll);
      
  
      return () => {
        socket?.off?.('lucky7Socket');
        socket?.off?.("initialDiceRoll")
      };
    }, []);

    const winStreak = useSelector((state: RootState) => state.streaks.value);

    return (
        <div style ={{padding: "10px"}}>
            <Wager user={user} onSubmitCallback={playLucky7Callback}/>
            { response && 
              (<div style = {{padding: "10px"}}>{renderReponse(response)}</div>)
            }

            <Grid item xs={12}>
              <RollsDisplay rolls={diceRolls}/>
              <Grid item xs={12} sx={{height: "3rem", justifyItems: "flex-end"}}>
                <div style={{paddingTop: "1rem"}}>
                    <Typography sx={{display: "inline"}}>Current win streak:</Typography>
                    <Typography sx={{display: "inline", fontWeight: "400", paddingLeft: "0.5rem"}}>{winStreak}</Typography>
                </div>
              </Grid>
            </Grid>
        </div>
    )
};

export default Lucky7;