import {Divider, Menu} from "@mui/material";

import LogoutOption from "./HeaderOptions/LogoutOption";
import ToggleDarkModeOption from "./HeaderOptions/ToggleDarkModeOption";
import UserOption from "./HeaderOptions/UserOption";

interface Props
{
  anchorEl: HTMLElement | null,
  closeFn: () => void
}

const HeaderMenu: React.FC<Props> = ({anchorEl, closeFn}) => {
  const isOpen = Boolean(anchorEl);

  return (
    <>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={isOpen}
        onClose={closeFn}
        onClick={closeFn}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <UserOption/>
        <Divider/>
        <ToggleDarkModeOption/>
        <LogoutOption/>
      </Menu>
    </>
  );
}

export default HeaderMenu
