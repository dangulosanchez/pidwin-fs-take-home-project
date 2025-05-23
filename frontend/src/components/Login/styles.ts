import { SxProps, Theme } from "@mui/material";
import { theme } from "../../themes/Default";

interface StylesInterface {
  paper: SxProps<Theme>;
  avatar: SxProps<Theme>;
  form: React.CSSProperties;
  submit: SxProps<Theme>;
}

export const styles: StylesInterface = {
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: theme.spacing(2),
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: "#5e5d5c",
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
};