import { useThemeContext } from '../context/ThemeContext';

export const useTheme = () => {
  const { theme, setTheme } = useThemeContext();
  return [theme, setTheme];
};
