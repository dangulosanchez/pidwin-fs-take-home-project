// React
import { useState, useEffect } from "react";
// Types
import { LiveStreaks } from "../../types";
// Sockets
import { getSocket } from '../../socket';
import { getWinStreaks } from "../../api";
// Components
import StreaksTable from "./StreaksTable";

const Streaks: React.FC= () => {

    const socket = getSocket();
    const [streaks, setStreaks] = useState<LiveStreaks[] | undefined>(undefined);

    useEffect(() => {
      const fetchStreaks = async () => {
        try {
          const data = await getWinStreaks();
          if (data) {
            setStreaks(data.data.streaks);
          }
        }
        catch (error) {
          console.log(error);
        }
      }
      fetchStreaks();
    }, [])

    useEffect(() => {
      function onWinStreaksReceipt(value: LiveStreaks[]) {
        setStreaks(value);
      }

  
      socket?.on?.('winstreaksSocket', onWinStreaksReceipt);
  
      return () => {
        socket?.off?.('winstreaksSocket', onWinStreaksReceipt);
      };
    }, [socket]);

    const streaksToDisplay = streaks ?? [];

    return (
        <div style={{padding: "1rem"}}>
          <StreaksTable streaks={streaksToDisplay}/>
        </div>
    )
}

export default Streaks;