// UI
import { Grid } from "@mui/material";
// Types
import { RollsDisplayProps } from "../../types/props";

const DICE_FACES = ['⚀','⚁','⚂','⚃','⚄','⚅'];

const centerContent = {justifyContent: "space-between", alignContent: "center", alignItems: "center"};

const getDice = (d: number) => {
    return DICE_FACES[d - 1] || '';
}

const getDie = (dice: number[], isLucky7: boolean) => {
    if(dice.length < 2){
        return <></>;
    }
    return (
        <div style={{fontSize: "2.5rem", height: "7rem", ...centerContent, margin: "10px"}}>
            {getDice(dice[0])}    {getDice(dice[1])}
            <br />
            <div style={{ ...centerContent, paddingLeft: "1rem"}}><span style={{fontSize: "1rem",}}>{["❌", "✅"][+isLucky7]}</span></div>
        </div>
    )
}

const RollsDisplay: React.FC<RollsDisplayProps> = ({ rolls }) => {

    const renderRolls = rolls.map((roll) => {
        return (
            <Grid item key={roll.timestamp} xs={2}>
                {getDie(roll.dice, roll.isLucky7)}
            </Grid>
        )
    })

    return (
        <Grid container direction={"row"} sx={{...centerContent}}>
            {renderRolls}
       </Grid>
    )
};

export default RollsDisplay;