import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { supabase } from "../lib/supabase";

export default function Login() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recuperacaoAberta, setRecuperacaoAberta] = useState(false);
  const [metodoRecuperacao, setMetodoRecuperacao] = useState<"email" | "celular">("email");
  const [contatoRecuperacao, setContatoRecuperacao] = useState("");

  async function entrar() {
    const emailLimpo = email.trim().toLowerCase();

    if (!emailLimpo || !senha.trim()) {
      Alert.alert("Campos obrigatórios", "Preencha seu e-mail e sua senha.");
      return;
    }

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailLimpo);
    if (!emailValido) {
      Alert.alert("E-mail inválido", "Digite um e-mail válido.");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailLimpo,
        password: senha,
      });

      if (error) throw error;

      // Garante que existe na tabela profiles
      if (data.user) {
        const { data: perfil } = await supabase
          .from("profiles")
          .select("id")
          .eq("id", data.user.id)
          .single();

        if (!perfil) {
          await supabase.from("profiles").insert({
            id: data.user.id,
            email: emailLimpo,
            nome: data.user.user_metadata?.nome || emailLimpo.split("@")[0],
            avatar_url: null,
          });
        }
      }

      router.replace("/home");
    } catch (e: any) {
      Alert.alert("Erro ao entrar", e.message || "Verifique seu e-mail e senha.");
    } finally {
      setLoading(false);
    }
  }

  function entrarComGoogle() {
    Alert.alert("Em breve", "Login com Google ainda vamos configurar.");
  }

  function recuperarSenha() {
    setRecuperacaoAberta((aberta) => !aberta);
    setContatoRecuperacao("");
    setMetodoRecuperacao("email");
  }

  async function enviarRecuperacao() {
    const contato = contatoRecuperacao.trim().toLowerCase();
    if (!contato) {
      Alert.alert("Campo obrigatório", "Digite seu e-mail cadastrado.");
      return;
    }
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(contato);
      if (error) throw error;
      Alert.alert("E-mail enviado", "Se esse e-mail existir, você receberá o link de recuperação.");
      setRecuperacaoAberta(false);
    } catch (e: any) {
      Alert.alert("Erro", e.message);
    }
  }

  function irParaCadastro() {
    router.push("/cadastro");
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 30 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.conteudo}>
          <Image source={require("../../assets/images/Teresa_Silva_logo_transparente.png")} style={styles.logo} resizeMode="contain" />
          <Text style={styles.titulo}>Bem-vinda!</Text>
          <Text style={styles.subtitulo}>Entre na sua conta para continuar</Text>

          <View style={styles.formulario}>
            <Text style={styles.label}>E-mail</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={21} color="#A07870" style={styles.icone} />
              <TextInput style={styles.input} placeholder="Digite seu e-mail" placeholderTextColor="#A99B96" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} />
            </View>

            <Text style={styles.label}>Senha</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={21} color="#A07870" style={styles.icone} />
              <TextInput style={styles.input} placeholder="Digite sua senha" placeholderTextColor="#A99B96" value={senha} onChangeText={setSenha} secureTextEntry={!mostrarSenha} autoCapitalize="none" onSubmitEditing={entrar} />
              <TouchableOpacity onPress={() => setMostrarSenha((m) => !m)} style={styles.botaoOlho}>
                <Ionicons name={mostrarSenha ? "eye-off-outline" : "eye-outline"} size={22} color="#A07870" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.esqueciSenha} onPress={recuperarSenha}>
              <Text style={styles.textoEsqueciSenha}>{recuperacaoAberta ? "Fechar recuperação" : "Esqueci minha senha"}</Text>
            </TouchableOpacity>

            {recuperacaoAberta && (
              <View style={styles.caixaRecuperacao}>
                <Text style={styles.tituloRecuperacao}>Recuperar senha</Text>
                <Text style={styles.label}>E-mail cadastrado</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="mail-outline" size={21} color="#A07870" style={styles.icone} />
                  <TextInput style={styles.input} placeholder="Digite seu e-mail" placeholderTextColor="#A99B96" value={contatoRecuperacao} onChangeText={setContatoRecuperacao} keyboardType="email-address" autoCapitalize="none" />
                </View>
                <TouchableOpacity style={styles.botaoRecuperar} onPress={enviarRecuperacao}>
                  <Text style={styles.textoBotaoRecuperar}>Enviar link</Text>
                  <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            )}

            <TouchableOpacity style={styles.botaoEntrar} onPress={entrar} disabled={loading}>
              {loading ? <ActivityIndicator color="#FFF" /> : <><Text style={styles.textoBotaoEntrar}>Entrar</Text><Ionicons name="arrow-forward" size={20} color="#FFFFFF" /></>}
            </TouchableOpacity>

            <View style={styles.divisorContainer}><View style={styles.linhaDivisor} /><Text style={styles.textoDivisor}>ou</Text><View style={styles.linhaDivisor} /></View>

            <TouchableOpacity style={styles.botaoGoogle} onPress={entrarComGoogle}>
              <Image source={{ uri: "https://developers.google.com/identity/images/g-logo.png" }} style={styles.logoGoogle} />
              <Text style={styles.textoBotaoGoogle}>Continuar com Google</Text>
            </TouchableOpacity>

            <View style={styles.linhaCadastro}>
              <Text style={styles.textoCadastro}>Ainda não tem uma conta?</Text>
              <TouchableOpacity onPress={irParaCadastro}><Text style={styles.linkCadastro}> Cadastre-se</Text></TouchableOpacity>
            </View>
          </View>
          <Text style={styles.rodape}>Teresa Nails · Cuidado e beleza em cada detalhe</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7F0EC" },
  scrollContent: { flexGrow: 1, justifyContent: "center" },
  conteudo: { width: "100%", maxWidth: 480, alignSelf: "center", paddingHorizontal: 28 },
  logo: { width: 300, height: 300, alignSelf: "center", marginBottom: -150, top: -60 },
  titulo: { fontSize: 30, fontWeight: "700", color: "#E65C91", textAlign: "center", marginBottom: 8 },
  subtitulo: { fontSize: 15, color: "#84736D", textAlign: "center", marginBottom: 32 },
  formulario: { width: "100%" },
  label: { 
    fontSize: 14, 
    fontWeight: "600", 
    color: "#E65C91", 
    marginBottom: 9, 
    marginTop: 14 
  },
  inputContainer: { minHeight: 54, flexDirection: "row", alignItems: "center", backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#E8DAD4", borderRadius: 14, paddingHorizontal: 14 },
  icone: { marginRight: 10 },
  input: { flex: 1, minHeight: 52, fontSize: 15, color: "#171514", paddingVertical: 10 },
  botaoOlho: { padding: 6, marginLeft: 4 },
  esqueciSenha: { alignSelf: "flex-end", marginTop: 14, marginBottom: 25 },
  textoEsqueciSenha: { fontSize: 13, fontWeight: "600", color: "#B56E61" },
  caixaRecuperacao: { backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#E8DAD4", borderRadius: 18, padding: 18, marginBottom: 22 },
  tituloRecuperacao: { fontSize: 19, fontWeight: "700", color: "#171514", marginBottom: 8 },
  botaoRecuperar: { minHeight: 48, backgroundColor: "#DC4881", borderRadius: 12, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 18 },
  textoBotaoRecuperar: { color: "#FFFFFF", fontSize: 15, fontWeight: "700" },
  botaoEntrar: { minHeight: 54, backgroundColor: "#DC4881", borderRadius: 14, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, elevation: 2 },
  textoBotaoEntrar: { fontSize: 16, fontWeight: "700", color: "#FFFFFF" },
  divisorContainer: { flexDirection: "row", alignItems: "center", marginVertical: 22, gap: 12 },
  linhaDivisor: { flex: 1, height: 1, backgroundColor: "#E8DAD4" },
  textoDivisor: { fontSize: 13, color: "#A99B96" },
  botaoGoogle: { minHeight: 54, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#E8DAD4", borderRadius: 14, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 12 },
  logoGoogle: { width: 22, height: 22 },
  textoBotaoGoogle: { fontSize: 15, fontWeight: "600", color: "#171514" },
  linhaCadastro: { flexDirection: "row", justifyContent: "center", alignItems: "center", flexWrap: "wrap", marginTop: 26 },
  textoCadastro: { fontSize: 14, color: "#84736D" },
  linkCadastro: { fontSize: 14, fontWeight: "700", color: "#B56E61" },
  rodape: { fontSize: 12, color: "#A99B96", textAlign: "center", marginTop: 38 },
});