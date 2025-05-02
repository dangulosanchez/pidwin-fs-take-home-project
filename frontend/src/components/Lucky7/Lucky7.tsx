// React
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../reducers";
// MUI
import { Grid, Typography } from "@mui/material";
// Sockets
import { socket } from '../../socket';
// Actions
import { setStreaks, setTokens } from "../../actions/tokens";
// Components
import Wager from "./Wager";
import RollsDisplay from "./RollsDisplay";
// Types
import { LiveRolls, Lucky7Response, UserDocument } from "../../types";

type Lucky7Props = {
    user: UserDocument;
}

const renderReponse = (response: Lucky7Response) => {
  if(response?.payout){
    return <Typography>Congratulations!</Typography>
  }
  if(isValidErrorMessage(String(response?.message ?? ""))){
    return <Typography>{response?.message}</Typography>
  }
  return <Typography>Sorry! Try again!</Typography>
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
  return rollsDisplay.slice(-5);
}

const Lucky7: React.FC<Lucky7Props> = (props) => {

    const dispatch = useDispatch();

    const [isConnected, setIsConnected] = useState(socket.connected);
    const [diceRolls, setDiceRolls] = useState([] as LiveRolls[]);
    const [response, setResponse] = useState<Lucky7Response | undefined>(undefined);

    const playLucky7Callback = async (response: Lucky7Response) => {
      if(response.tokens){
        dispatch(setTokens(response.tokens));
      }
      setResponse(response);
      if(response.wageAccepted){
        dispatch(setStreaks(response.streak ?? 0));
        setDiceRolls(getLucky7RollsToDisplay([...diceRolls, {dice: response.dice ?? [], isLucky7: Boolean(response.isLucky7), timestamp: response.timestamp || 0}]));
      }
    }

    const { user } = props;
  
    useEffect(() => {
      function onConnect() {
        setIsConnected(true);
      }
  
      function onDisconnect() {
        setIsConnected(false);
      }
  
      function onNewLucky7Roll(value: LiveRolls) {
        setDiceRolls(previous => getLucky7RollsToDisplay([...previous, value]));
      }
  
      socket.on('connect', onConnect);
      socket.on('disconnect', onDisconnect);
      socket.on('lucky7Socket', onNewLucky7Roll);
  
      return () => {
        socket.off('connect', onConnect);
        socket.off('disconnect', onDisconnect);
        socket.off('lucky7Socket', onNewLucky7Roll);
      };
    }, []);

    let winStreak = useSelector((state: RootState) => state.streaks.value);

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