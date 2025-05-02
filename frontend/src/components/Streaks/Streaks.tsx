import { useState, useEffect } from "react";
import { LiveStreaks } from "../../types";
// Sockets
import { socket } from '../../socket';



const Streaks: React.FC= ({  }) => {

    const [streaks, setStreaks] = useState<LiveStreaks[] | undefined>(undefined);

    useEffect(() => {
      function onWinStreaksReceipt(value: LiveStreaks[]) {
        console.log("value", value);
        setStreaks(value);
      }
  
      socket.on('winstreaksSocket', onWinStreaksReceipt);
  
      return () => {
        socket.off('winstreaksSocket', onWinStreaksReceipt);
      };
    }, []);

    const streaksToDisplay = streaks ?? [];

    return (
        <div style={{padding: "1rem"}}>
          <p>{JSON.stringify(streaksToDisplay)}</p>
          {streaksToDisplay.map((streak) => {
            return (
              <>
                {JSON.stringify(streak)}
              </>
            )
          })}
        </div>
    )
}

export default Streaks;