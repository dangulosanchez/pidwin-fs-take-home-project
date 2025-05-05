// React
import { useState } from "react";
import { RootState } from "../../reducers";
import { useSelector } from "react-redux";

// UI
import { Button, Checkbox, Grid } from "@mui/material";
// Types
import { WagerProps } from "../../types/props";
// API
import { playLucky7 } from "../../api";

const Wager: React.FC<WagerProps> = ({ user, onSubmitCallback }) => {

    const [tokensToWager, setTokensToWager] = useState(0);
    const [isLucky7Input, setIsLucky7Input] = useState(false);

    const tokenCount = useSelector((state: RootState) => state.tokens.value);

    const disableWagerButton = !tokensToWager || !tokenCount || tokenCount < tokensToWager;

    return (
        <>
            <Grid container direction={"row"} sx={{justifyContent: "space-between", alignContent: "center", alignItems: "center", padding: "10px"}}>
                <Grid item xs={9}>
                    <label>
                        Tokens to wager:
                        <input 
                            type="number"
                            name="wager"
                            value={tokensToWager}
                            max={user.tokens}
                            min={0}
                            onChange={(e) => setTokensToWager(+e.target.value)}
                        />
                    </label>
                </Grid>
                <Grid item xs={3}>
                        <label>
                            Is lucky 7?:
                            <Checkbox
                                value={isLucky7Input}
                                onChange={(_e) => setIsLucky7Input(!isLucky7Input)}
                            >
                            </Checkbox>
                    </label>
                </Grid>
            </Grid>
            <Grid container direction={"row"} sx={{justifyContent: "center", alignContent: "center", alignItems: "center", padding: "5px"}} >
                <Button variant="contained" sx={{width: "25rem"}} disabled={disableWagerButton} onClick={async () => {
                    const lucky7Response = await playLucky7({
                        tokens: tokensToWager,
                        email: user.email,
                        isLucky7: isLucky7Input,
                    })
                    onSubmitCallback(lucky7Response?.data);
                }}>
                    WAGER
                </Button>
            </Grid> 
        </>
    )
}

export default Wager;