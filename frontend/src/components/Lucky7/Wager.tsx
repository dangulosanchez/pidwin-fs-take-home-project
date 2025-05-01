import { Button, Checkbox, Grid } from "@mui/material";
import { useState, useEffect } from "react";
import { Lucky7Response, UserDocument } from "../../types";
import { playLucky7 } from "../../api";

type WagerProps = {
    user: UserDocument;
    onSubmitCallback: (response: Lucky7Response) => void;
}

const Wager: React.FC<WagerProps> = ({ user, onSubmitCallback }) => {

    const [tokensToWager, setTokensToWager] = useState(0);
    const [isLucky7Input, setIsLucky7Input] = useState(false);

    return (
        <>
            <Grid container direction={"row"} sx={{justifyContent: "space-between", alignContent: "center", alignItems: "center"}}>
                <Grid item xs={8}>
                    <label>
                        Tokens to wager:
                        <input type="number" name="wager" value={tokensToWager} max={user.tokens} onChange={(e) => setTokensToWager(+e.target.value)}/>
                    </label>
                </Grid>
                <Grid item xs={4}>
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
            <Grid container direction={"row"} sx={{justifyContent: "center", alignContent: "center", alignItems: "center"}} >
                <Button variant="contained" sx={{width: "25rem"}} disabled={Boolean(!user.tokens || user?.tokens < tokensToWager )} onClick={async () => {
                    const lucky7Response = await playLucky7({
                        tokens: tokensToWager,
                        email: user.email,
                        isLucky7: isLucky7Input,
                    })
                    onSubmitCallback(lucky7Response?.data);
                }}>
                    Wager!
                </Button>
            </Grid> 
        </>
    )
}

export default Wager;