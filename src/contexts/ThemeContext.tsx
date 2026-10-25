
import React, { createContext, useContext, useEffect, useState, ReactNode,} from "react";
import { Appearance, ColorSchemeName, useColorScheme,} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type Tema = "claro" | "escuro" | "automatico";

type Cores = {
  fundo: string;
  card: string;
  texto: string;
  textoSecundario: string;
  rosa: string;
  rosaClaro: string;
  dourado: string;
  borda: string;
  input: string;
  icone: string;
};

type ThemeContextType = {
  tema: Tema;
  dark: boolean;
  cores: Cores;
  setTema: (tema: Tema) => Promise<void>;
  carregandoTema: boolean;
};

const CHAVE_TEMA = "@teresaNails:tema";

const CORES_CLARAS: Cores = {
  fundo: "#F7F0EC",
  card: "#FFFFFF",
  texto: "#171514",
  textoSecundario: "#77706B",
  rosa: "#DC4881",
  rosaClaro: "#FCE4ED",
  dourado: "#C9A86A",
  borda: "#E9DCD3",
  input: "#FFFFFF",
  icone: "#C9A86A",
};

const CORES_ESCURAS: Cores = {
  fundo: "#171514",
  card: "#262321",
  texto: "#FFFFFF",
  textoSecundario: "#C5BDB7",
  rosa: "#E65C91",
  rosaClaro: "#452A36",
  dourado: "#D8B879",
  borda: "#49413D",
  input: "#302C29",
  icone: "#D8B879",
};

const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);

export function ThemeProvider({
  children,
}: {
  children: ReactNode;
}) {
  const esquemaDispositivo = useColorScheme();
  const [tema, setTemaAtual] = useState<Tema>("claro");
  const [carregandoTema, setCarregandoTema] = useState(true);
  const esquemaEfetivo =  tema === "automatico" ? (esquemaDispositivo ?? "light") : tema === "escuro" ? "dark" : "light";
  const dark = esquemaEfetivo === "dark";

  useEffect(() => {
    async function carregarTema() {
      try {
        const salvo = await AsyncStorage.getItem(CHAVE_TEMA);

        if (
          salvo === "claro" ||
          salvo === "escuro" ||
          salvo === "automatico"
        ) {
          setTemaAtual(salvo);
        }
      } catch (erro) {
        console.warn("Não foi possível carregar o tema:", erro);
      } finally {
        setCarregandoTema(false);
      }
    }

    carregarTema();
  }, []);

  async function setTema(novoTema: Tema) {
    setTemaAtual(novoTema);

    try {
      await AsyncStorage.setItem(CHAVE_TEMA, novoTema);
    } catch (erro) {
      console.warn("Não foi possível salvar o tema:", erro);
    }
  }

  const cores = dark ? CORES_ESCURAS : CORES_CLARAS;

  return (
    <ThemeContext.Provider
      value={{
        tema,
        dark,
        cores,
        setTema,
        carregandoTema,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      "useTheme precisa ser utilizado dentro de ThemeProvider."
    );
  }

  return context;
}
