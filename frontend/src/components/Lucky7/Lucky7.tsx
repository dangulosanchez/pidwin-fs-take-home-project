import { Grid, Typography } from "@mui/material";
import { useState, useEffect } from "react";

import { socket } from '../../socket';
import { Lucky7Response, UserDocument } from "../../types";
import Wager from "./Wager";

function ConnectionState({ isConnected } : Record<string, boolean>) {
    return <p>State: { '' + isConnected }</p>;
  }
  
function ConnectionManager() {
    function connect() {
        console.log("connecting")
        socket.connect();
    }

    function disconnect() {
        socket.disconnect();
    }

    return (
        <>
            <button onClick={ connect }>Connect</button>
            <button onClick={ disconnect }>Disconnect</button>
        </>
    );
}
  
  
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
}

const isValidErrorMessage = (msg: string) => {
  if(!msg?.length){
    return false;
  }
  const sanitizedMessage = String(msg ?? "").toLocaleLowerCase();
  return sanitizedMessage !== "undefined";
}
const Lucky7: React.FC<Lucky7Props> = (props) => {

    const [isConnected, setIsConnected] = useState(socket.connected);
    const [fooEvents, setFooEvents] = useState([] as any[]);
    const [response, setResponse] = useState<Lucky7Response | undefined>(undefined);

    const playLucky7Callback = (response: Lucky7Response) => {
      console.log("response", response);
      setResponse(response);
    }

    const { user } = props;
  
    useEffect(() => {
      function onConnect() {
        setIsConnected(true);
      }
  
      function onDisconnect() {
        setIsConnected(false);
      }
  
      function onLucky7Response(value: any[]) {
        console.log("Play lucky 7 response", value);
        setFooEvents(previous => [...previous, value].slice(-5));
      }
  
      socket.on('connect', onConnect);
      socket.on('disconnect', onDisconnect);
      socket.on('lucky7Socket', onLucky7Response);
  
      return () => {
        socket.off('connect', onConnect);
        socket.off('disconnect', onDisconnect);
        socket.off('lucky7Socket', onLucky7Response);
      };
    }, []);

    return (
        <>
            <Wager user={user} onSubmitCallback={playLucky7Callback}/>
            { response && renderReponse(response)}
            <Grid item xs={12}>
                <ConnectionState isConnected={ isConnected } />
                <ConnectionManager />
                <button onClick={() => {
                    console.log("gonna emit test lol")
                    socket.emit("lucky7Socket", [{"message": "hello"}]);
                }}>socket test 2</button>
                <p>{JSON.stringify(fooEvents || {})}</p>
            </Grid>
        </>
    )
};

export default Lucky7;