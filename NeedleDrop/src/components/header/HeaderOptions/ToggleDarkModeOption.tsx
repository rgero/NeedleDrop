import { DarkModeOutlined, Sunny } from '@mui/icons-material';

import MenuOption from '@interfaces/MenuOption';
import { useDarkMode } from '@context/theme/DarkModeContext';

const ToggleDarkModeOption = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  return (
    <MenuOption icon={isDarkMode ? <Sunny/> : <DarkModeOutlined/> } text="Toggle Dark Mode" onClick={toggleDarkMode}/>
  )
}

export default ToggleDarkModeOption
