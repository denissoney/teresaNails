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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Login() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const [recuperacaoAberta, setRecuperacaoAberta] = useState(false);
  const [metodoRecuperacao, setMetodoRecuperacao] = useState<
    "email" | "celular"
  >("email");
  const [contatoRecuperacao, setContatoRecuperacao] = useState("");

  function entrar() {
    const emailLimpo = email.trim();

    if (!emailLimpo || !senha.trim()) {
      Alert.alert(
        "Campos obrigatórios",
        "Preencha seu e-mail e sua senha para continuar."
      );
      return;
    }

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailLimpo);

    if (!emailValido) {
      Alert.alert("E-mail inválido", "Digite um endereço de e-mail válido.");
      return;
    }

    if (senha.length < 6) {
      Alert.alert(
        "Senha inválida",
        "A senha deve ter pelo menos 6 caracteres."
      );
      return;
    }

    router.replace("/home");
  }

  // LOGIN COM GOOGLE
  // A autenticação real será conectada ao Supabase posteriormente.
  function entrarComGoogle() {
    Alert.alert(
      "Login com Google",
      "Para entrar com sua conta Google, precisamos configurar a autenticação no Supabase."
    );
  }

  // ABRE OU FECHA A RECUPERAÇÃO DE SENHA
  function recuperarSenha() {
    setRecuperacaoAberta((aberta) => !aberta);
    setContatoRecuperacao("");
    setMetodoRecuperacao("email");
  }

  // VALIDA O E-MAIL OU CELULAR INFORMADO
  function enviarRecuperacao() {
    const contato = contatoRecuperacao.trim();

    if (!contato) {
      Alert.alert(
        "Campo obrigatório",
        metodoRecuperacao === "email"
          ? "Digite seu e-mail cadastrado."
          : "Digite seu número de celular com DDD."
      );
      return;
    }

    if (metodoRecuperacao === "email") {
      const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contato);

      if (!emailValido) {
        Alert.alert("E-mail inválido", "Digite um e-mail válido.");
        return;
      }

      Alert.alert(
        "E-mail validado",
        "O e-mail foi validado. Para enviar o link de recuperação, precisamos conectar um serviço de autenticação."
      );

      return;
    }

    const numero = contato.replace(/\D/g, "");

    if (numero.length < 10 || numero.length > 13) {
      Alert.alert(
        "Celular inválido",
        "Digite um número válido com DDD, incluindo o código do país se necessário."
      );
      return;
    }

    Alert.alert(
      "Celular validado",
      "O número foi validado. Para enviar o código por SMS, precisamos conectar um serviço de autenticação."
    );
  }

  // ABRE A TELA DE CADASTRO
  function irParaCadastro() {
    router.push("/cadastro");
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + 20,
            paddingBottom: insets.bottom + 30,
          },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.conteudo}>
          {/* LOGO */}
          <Image
            source={require("../../assets/images/Teresa_Silva_logo_transparente.png")}
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={styles.titulo}>Bem-vinda!</Text>

          <Text style={styles.subtitulo}>
            Entre na sua conta para continuar
          </Text>

          <View style={styles.formulario}>
            {/* E-MAIL */}
            <Text style={styles.label}>E-mail</Text>

            <View style={styles.inputContainer}>
              <Ionicons
                name="mail-outline"
                size={21}
                color="#A07870"
                style={styles.icone}
              />

              <TextInput
                style={styles.input}
                placeholder="Digite seu e-mail"
                placeholderTextColor="#A99B96"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                returnKeyType="next"
              />
            </View>

            {/* SENHA */}
            <Text style={styles.label}>Senha</Text>

            <View style={styles.inputContainer}>
              <Ionicons
                name="lock-closed-outline"
                size={21}
                color="#A07870"
                style={styles.icone}
              />

              <TextInput
                style={styles.input}
                placeholder="Digite sua senha"
                placeholderTextColor="#A99B96"
                value={senha}
                onChangeText={setSenha}
                secureTextEntry={!mostrarSenha}
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="password"
                returnKeyType="done"
                onSubmitEditing={entrar}
              />

              <TouchableOpacity
                onPress={() => setMostrarSenha((mostrar) => !mostrar)}
                style={styles.botaoOlho}
                accessibilityLabel={
                  mostrarSenha ? "Ocultar senha" : "Mostrar senha"
                }
              >
                <Ionicons
                  name={mostrarSenha ? "eye-off-outline" : "eye-outline"}
                  size={22}
                  color="#A07870"
                />
              </TouchableOpacity>
            </View>

            {/* ESQUECI MINHA SENHA */}
            <TouchableOpacity
              style={styles.esqueciSenha}
              onPress={recuperarSenha}
              activeOpacity={0.7}
            >
              <Text style={styles.textoEsqueciSenha}>
                {recuperacaoAberta
                  ? "Fechar recuperação"
                  : "Esqueci minha senha"}
              </Text>
            </TouchableOpacity>

            {/* ÁREA DE RECUPERAÇÃO */}
            {recuperacaoAberta && (
              <View style={styles.caixaRecuperacao}>
                <Text style={styles.tituloRecuperacao}>
                  Recuperar senha
                </Text>

                <Text style={styles.descricaoRecuperacao}>
                  Escolha como deseja recuperar o acesso à sua conta.
                </Text>

                {/* ESCOLHA DO MÉTODO */}
                <View style={styles.opcoesRecuperacao}>
                  <TouchableOpacity
                    style={[
                      styles.opcaoRecuperacao,
                      metodoRecuperacao === "email" &&
                        styles.opcaoSelecionada,
                    ]}
                    onPress={() => {
                      setMetodoRecuperacao("email");
                      setContatoRecuperacao("");
                    }}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name="mail-outline"
                      size={21}
                      color={
                        metodoRecuperacao === "email"
                          ? "#DC4881"
                          : "#A07870"
                      }
                    />

                    <Text
                      style={[
                        styles.textoOpcao,
                        metodoRecuperacao === "email" &&
                          styles.textoOpcaoSelecionada,
                      ]}
                    >
                      E-mail
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.opcaoRecuperacao,
                      metodoRecuperacao === "celular" &&
                        styles.opcaoSelecionada,
                    ]}
                    onPress={() => {
                      setMetodoRecuperacao("celular");
                      setContatoRecuperacao("");
                    }}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name="phone-portrait-outline"
                      size={21}
                      color={
                        metodoRecuperacao === "celular"
                          ? "#DC4881"
                          : "#A07870"
                      }
                    />

                    <Text
                      style={[
                        styles.textoOpcao,
                        metodoRecuperacao === "celular" &&
                          styles.textoOpcaoSelecionada,
                      ]}
                    >
                      Celular
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* CAMPO DINÂMICO */}
                <Text style={styles.label}>
                  {metodoRecuperacao === "email"
                    ? "E-mail cadastrado"
                    : "Celular com DDD"}
                </Text>

                <View style={styles.inputContainer}>
                  <Ionicons
                    name={
                      metodoRecuperacao === "email"
                        ? "mail-outline"
                        : "call-outline"
                    }
                    size={21}
                    color="#A07870"
                    style={styles.icone}
                  />

                  <TextInput
                    style={styles.input}
                    placeholder={
                      metodoRecuperacao === "email"
                        ? "Digite seu e-mail"
                        : "(82) 99999-9999"
                    }
                    placeholderTextColor="#A99B96"
                    value={contatoRecuperacao}
                    onChangeText={setContatoRecuperacao}
                    keyboardType={
                      metodoRecuperacao === "email"
                        ? "email-address"
                        : "phone-pad"
                    }
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>

                <TouchableOpacity
                  style={styles.botaoRecuperar}
                  onPress={enviarRecuperacao}
                  activeOpacity={0.8}
                >
                  <Text style={styles.textoBotaoRecuperar}>
                    Continuar
                  </Text>

                  <Ionicons
                    name="arrow-forward"
                    size={18}
                    color="#FFFFFF"
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.botaoCancelar}
                  onPress={() => {
                    setRecuperacaoAberta(false);
                    setContatoRecuperacao("");
                  }}
                >
                  <Text style={styles.textoCancelar}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* ENTRAR */}
            <TouchableOpacity
              style={styles.botaoEntrar}
              onPress={entrar}
              activeOpacity={0.8}
            >
              <Text style={styles.textoBotaoEntrar}>Entrar</Text>

              <Ionicons
                name="arrow-forward"
                size={20}
                color="#FFFFFF"
              />
            </TouchableOpacity>

            {/* DIVISOR */}
            <View style={styles.divisorContainer}>
              <View style={styles.linhaDivisor} />
              <Text style={styles.textoDivisor}>ou</Text>
              <View style={styles.linhaDivisor} />
            </View>

            {/* LOGIN COM GOOGLE */}
            <TouchableOpacity
              style={styles.botaoGoogle}
              onPress={entrarComGoogle}
              activeOpacity={0.8}
            >
              <Image
                source={{
                  uri: "https://developers.google.com/identity/images/g-logo.png",
                }}
                style={styles.logoGoogle}
                resizeMode="contain"
              />

              <Text style={styles.textoBotaoGoogle}>
                Continuar com Google
              </Text>
            </TouchableOpacity>

            {/* CADASTRO */}
            <View style={styles.linhaCadastro}>
              <Text style={styles.textoCadastro}>
                Ainda não tem uma conta?
              </Text>

              <TouchableOpacity onPress={irParaCadastro}>
                <Text style={styles.linkCadastro}> Cadastre-se</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* RODAPÉ */}
          <Text style={styles.rodape}>
            Teresa Nails · Cuidado e beleza em cada detalhe
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F0EC",
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
  },

  conteudo: {
    width: "100%",
    maxWidth: 480,
    alignSelf: "center",
    paddingHorizontal: 28,
  },

  logo: {
    width: 300,
    height: 300,
    alignSelf: "center",
    marginBottom: -150,
    top: -60,
  },

  titulo: {
    fontSize: 30,
    fontWeight: "700",
    color: "#171514",
    textAlign: "center",
    marginBottom: 8,
  },

  subtitulo: {
    fontSize: 15,
    color: "#84736D",
    textAlign: "center",
    marginBottom: 32,
  },

  formulario: {
    width: "100%",
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#171514",
    marginBottom: 9,
    marginTop: 14,
  },

  inputContainer: {
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E8DAD4",
    borderRadius: 14,
    paddingHorizontal: 14,
  },

  icone: {
    marginRight: 10,
  },

  input: {
    flex: 1,
    minHeight: 52,
    fontSize: 15,
    color: "#171514",
    paddingVertical: 10,
  },

  botaoOlho: {
    padding: 6,
    marginLeft: 4,
  },

  esqueciSenha: {
    alignSelf: "flex-end",
    marginTop: 14,
    marginBottom: 25,
  },

  textoEsqueciSenha: {
    fontSize: 13,
    fontWeight: "600",
    color: "#B56E61",
  },

  caixaRecuperacao: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E8DAD4",
    borderRadius: 18,
    padding: 18,
    marginBottom: 22,
    marginTop: 0,
  },

  tituloRecuperacao: {
    fontSize: 19,
    fontWeight: "700",
    color: "#171514",
    marginBottom: 8,
  },

  descricaoRecuperacao: {
    fontSize: 13,
    color: "#84736D",
    lineHeight: 19,
    marginBottom: 16,
  },

  opcoesRecuperacao: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 8,
  },

  opcaoRecuperacao: {
    flex: 1,
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#E8DAD4",
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
  },

  opcaoSelecionada: {
    borderColor: "#DC4881",
    backgroundColor: "#FFF0F6",
  },

  textoOpcao: {
    fontSize: 14,
    color: "#84736D",
    fontWeight: "500",
  },

  textoOpcaoSelecionada: {
    color: "#DC4881",
    fontWeight: "700",
  },

  botaoRecuperar: {
    minHeight: 48,
    backgroundColor: "#DC4881",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 18,
  },

  textoBotaoRecuperar: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },

  botaoCancelar: {
    alignItems: "center",
    paddingTop: 14,
    paddingBottom: 2,
  },

  textoCancelar: {
    color: "#84736D",
    fontSize: 14,
    fontWeight: "600",
  },

  botaoEntrar: {
    minHeight: 54,
    backgroundColor: "#DC4881",
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    elevation: 2,
  },

  textoBotaoEntrar: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  divisorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 22,
    gap: 12,
  },

  linhaDivisor: {
    flex: 1,
    height: 1,
    backgroundColor: "#E8DAD4",
  },

  textoDivisor: {
    fontSize: 13,
    color: "#A99B96",
  },

  botaoGoogle: {
    minHeight: 54,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E8DAD4",
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    marginTop: 0,
  },

  logoGoogle: {
    width: 22,
    height: 22,
  },

  textoBotaoGoogle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#171514",
  },

  linhaCadastro: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: 26,
  },

  textoCadastro: {
    fontSize: 14,
    color: "#84736D",
  },

  linkCadastro: {
    fontSize: 14,
    fontWeight: "700",
    color: "#B56E61",
  },

  rodape: {
    fontSize: 12,
    color: "#A99B96",
    textAlign: "center",
    marginTop: 38,
  },
});
