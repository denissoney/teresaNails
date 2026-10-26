import { useEffect, useState } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { ThemeProvider } from "../contexts/ThemeContext";
import { supabase } from "../lib/supabase";
import { ActivityIndicator, View } from "react-native";

SplashScreen.preventAutoHideAsync().catch(() => {});

const ROTAS_PUBLICAS = ["", "index", "cadastro", "cadastro-sucesso"];

export default function Layout() {
  const [ready, setReady] = useState(false);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    async function init() {
      // Esconde splash
      setTimeout(() => SplashScreen.hideAsync().catch(() => {}), 800);

      // Verifica sessão atual
      const { data: { session } } = await supabase.auth.getSession();
      setReady(true);

      // Se não tem sessão e não está em rota pública, manda pro login
      const rotaAtual = segments[0] || "";
      if (!session && !ROTAS_PUBLICAS.includes(rotaAtual)) {
        router.replace("/");
      }
    }

    init();

    // Escuta mudanças de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const rotaAtual = segments[0] || "";
      if (event === "SIGNED_OUT") {
        router.replace("/");
      } else if (event === "SIGNED_IN" && ROTAS_PUBLICAS.includes(rotaAtual)) {
        router.replace("/home");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!ready) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F7F0EC" }}>
        <ActivityIndicator size="large" color="#DC4881" />
      </View>
    );
  }

  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false, animation: "fade" }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="cadastro" />
        <Stack.Screen name="home" />
        <Stack.Screen name="agenda" />
        <Stack.Screen name="clientes" />
        <Stack.Screen name="financeiro" />
        <Stack.Screen name="mais" />
        <Stack.Screen name="perfil" />
        <Stack.Screen name="editar-perfil" />
        <Stack.Screen name="servicos" />
        <Stack.Screen name="horario" />
        <Stack.Screen name="horario-salvo" />
        <Stack.Screen name="pagamento" />
        <Stack.Screen name="aparencia" />
        <Stack.Screen name="sobre" />
        <Stack.Screen name="notificacoes" />
        <Stack.Screen name="novo-agendamento" />
        <Stack.Screen name="agendamento-salvo" />
        <Stack.Screen name="perfil-salvo" />
      </Stack>
    </ThemeProvider>
  );
}