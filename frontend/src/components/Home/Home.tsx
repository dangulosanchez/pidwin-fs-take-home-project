// React
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
// Sockets
import { getSocket } from "../../socket";
import { Socket } from "socket.io-client";
// UI
import { Button, Container, Grow, Paper, Typography } from "@mui/material";
import { success, error } from "../../messages";
// Components
import Lucky7 from "../Lucky7/Lucky7";
// Types
import { UserData } from "../../types/actionTypes";
// Actions
import { setStreaks, setTokens } from "../../actions/tokens";
// Utils
import { jwtDecode } from "jwt-decode";

const Home: React.FC = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  let user: UserData | null = null;
  const [socket, setSocket]= useState<null | Socket>(null);
  
    useEffect(() => {

      if(!socket) {
        return ;
      }
  
      socket.on('connect', () => {});
      socket.on('disconnect', () => {});
      socket.on("userTokens", (data: { tokens: number}) => {
        dispatch(setTokens(data.tokens))
      });

      socket.on("userWager", (data: { success: boolean; message: string; wager: number; gain: number}) => {
        if(data.success) { 
          success(data.message);
        }
        else { 
          error(data.message);
        }
      })

      socket.on("userStreak", (data: { streak: number}) => {
        dispatch(setStreaks(data.streak))
      })
  
      return () => {
        socket.off('connect', () => {});
        socket.off('disconnect', () => {});
        socket.off("userTokens", () => {});
      };
    }, [socket]);
  
  try {
    const profileStr = localStorage.getItem("profile");
    if (profileStr) {
      const profile = JSON.parse(profileStr);
      if (profile?.token) {
        user = jwtDecode<UserData>(profile.token);
        dispatch(setStreaks(user?.streak ?? 0));
        dispatch(setTokens(user.tokens));
        !socket && setSocket(getSocket(user.email));
      }
    }
  } catch (error) {
    console.error("Error parsing profile from localStorage:", error);
    user = null;
  }
  
  return (
    <Grow in>
      <Container component="main" maxWidth="sm">
        { user  ? (
            <>
              <Paper elevation={3}>
                <Typography variant="h4" align="center" color="primary">
                  {`Welcome ${user.name}`}
                </Typography>
              </Paper>
              <Paper elevation={3} sx={{marginTop: "30px"}}>
                <Lucky7 
                  user={user}
                />
              </Paper>
              <Paper elevation={3} sx={{marginTop: "30px", textAlign: "center"}}>
                <Button title="" 
                  onClick={() => navigate("/streaks")}
                >View Win Streaks Leaderboard</Button>
              </Paper>
            </>
        ) : (
          <Typography variant="h4" align="center" color="primary">
              Login to Play
            </Typography>
        )}
      </Container>
    </Grow>
  );
};

export default Home;