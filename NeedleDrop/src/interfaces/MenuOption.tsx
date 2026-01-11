import { MenuItem, type SvgIconProps, Typography } from "@mui/material";

import type { ReactElement } from "react";

interface GenericMenuItemProps {
  icon: ReactElement<SvgIconProps>;
  text: string;
  onClick?: () => void;
}

const MenuOption = ({ icon, text, onClick }: GenericMenuItemProps) => {
  return (
    <MenuItem onClick={onClick ? onClick : () => {}}>
      {icon}
      <Typography sx={{ marginLeft: "5px" }}>{text}</Typography>
    </MenuItem>
  );
};

export default MenuOption;
