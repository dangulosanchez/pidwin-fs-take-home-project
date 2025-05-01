import React from "react";
import { Container, Grow, Paper, Typography } from "@mui/material";
import { jwtDecode } from "jwt-decode";
import { UserData } from "../../types/actionTypes";
import Lucky7 from "../Lucky7/Lucky7";

const Home: React.FC = () => {
  let user: UserData | null = null;
  
  try {
    const profileStr = localStorage.getItem("profile");
    if (profileStr) {
      const profile = JSON.parse(profileStr);
      if (profile?.token) {
        user = jwtDecode<UserData>(profile.token);
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