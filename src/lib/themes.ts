export type Themes = {
  name: string;
  label: string;
  colors: {
    background: string;
    foreground: string;
    card: string;
    cardForeground: string;
    popover: string;
    popoverForeground: string;
    primary: string;
    primaryForeground: string;
    secondary: string;
    secondaryForeground: string;
    muted: string;
    mutedForeground: string;
    accent: string;
    accentForeground: string;
    destructive: string;
    destructiveForeground: string;
    border: string;
    input: string;
    ring: string;
  };
};

export const themes: Themes[] = [
  {
    name: "light",
    label: "Light",
    colors: {
      background: "0 0% 100%",
      foreground: "222.2 84% 4.9%",
      card: "0 0% 100%",
      cardForeground: "222.2 84% 4.9%",
      popover: "0 0% 100%",
      popoverForeground: "222.2 84% 4.9%",
      primary: "222.2 47.4% 11.2%",
      primaryForeground: "210 40% 98%",
      secondary: "210 40% 96.1%",
      secondaryForeground: "222.2 47.4% 11.2%",
      muted: "210 40% 96.1%",
      mutedForeground: "215.4 16.3% 46.9%",
      accent: "210 40% 96.1%",
      accentForeground: "222.2 47.4% 11.2%",
      destructive: "0 84.2% 60.2%",
      destructiveForeground: "210 40% 98%",
      border: "214.3 31.8% 91.4%",
      input: "214.3 31.8% 91.4%",
      ring: "222.2 84% 4.9%",
    },
  },
  {
    name: "dark",
    label: "Dark",
    colors: {
      background: "222.2 84% 4.9%",
      foreground: "210 40% 98%",
      card: "222.2 84% 4.9%",
      cardForeground: "210 40% 98%",
      popover: "222.2 84% 4.9%",
      popoverForeground: "210 40% 98%",
      primary: "210 40% 98%",
      primaryForeground: "222.2 47.4% 11.2%",
      secondary: "217.2 32.6% 17.5%",
      secondaryForeground: "210 40% 98%",
      muted: "217.2 32.6% 17.5%",
      mutedForeground: "215 20.2% 65.1%",
      accent: "217.2 32.6% 17.5%",
      accentForeground: "210 40% 98%",
      destructive: "0 62.8% 30.6%",
      destructiveForeground: "210 40% 98%",
      border: "217.2 32.6% 17.5%",
      input: "217.2 32.6% 17.5%",
      ring: "212.7 26.8% 83.9%",
    },
  },
  {
    name: "forest",
    label: "Forest",
    colors: {
      background: "120 50% 95%",
      foreground: "120 80% 5%",
      card: "120 50% 98%",
      cardForeground: "120 80% 5%",
      popover: "120 50% 98%",
      popoverForeground: "120 80% 5%",
      primary: "120 80% 30%",
      primaryForeground: "120 10% 98%",
      secondary: "120 30% 90%",
      secondaryForeground: "120 80% 30%",
      muted: "120 30% 90%",
      mutedForeground: "120 50% 40%",
      accent: "120 30% 90%",
      accentForeground: "120 80% 30%",
      destructive: "0 80% 50%",
      destructiveForeground: "0 10% 98%",
      border: "120 30% 85%",
      input: "120 30% 85%",
      ring: "120 80% 30%",
    },
  },
  {
    name: "ocean",
    label: "Ocean",
    colors: {
      background: "200 50% 95%",
      foreground: "200 80% 5%",
      card: "200 50% 98%",
      cardForeground: "200 80% 5%",
      popover: "200 50% 98%",
      popoverForeground: "200 80% 5%",
      primary: "200 80% 40%",
      primaryForeground: "200 10% 98%",
      secondary: "200 30% 90%",
      secondaryForeground: "200 80% 40%",
      muted: "200 30% 90%",
      mutedForeground: "200 50% 40%",
      accent: "200 30% 90%",
      accentForeground: "200 80% 40%",
      destructive: "0 80% 50%",
      destructiveForeground: "0 10% 98%",
      border: "200 30% 85%",
      input: "200 30% 85%",
      ring: "200 80% 40%",
    },
  },
];

export const getTheme = (name: string): Themes => {
  return themes.find((theme) => theme.name === name) || themes[0];
};
