import { TableCell, styled, tableCellClasses } from "@mui/material";

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    whiteSpace: "nowrap",
    lineHeight: 1.2,
    height: 48,
    paddingTop: theme.spacing(1.25),
    paddingBottom: theme.spacing(1.25),
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: 0,
    height: 52,
    lineHeight: 1.4,
    paddingTop: theme.spacing(1.25),
    paddingBottom: theme.spacing(1.25),
    verticalAlign: "middle",
    "& .MuiTypography-root": {
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
  },
}));