
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

const FUNDO = "#F7F0EC";
const TEXTO = "#171514";
const COR_BOTAO = "#E88F75";
const BRANCO = "#FFFFFF";

export default function Cadastro() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);

  function cadastrar() {
    if (
      !nome.trim() ||
      !email.trim() ||
      !telefone.trim() ||
      !senha ||
      !confirmarSenha
    ) {
      Alert.alert(
        "Campos obrigatórios",
        "Preencha todos os campos para continuar."
      );
      return;
    }

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

    if (!emailValido) {
      Alert.alert("E-mail inválido", "Digite um endereço de e-mail válido.");
      return;
    }

    if (senha.length < 6) {
      Alert.alert(
        "Senha muito curta",
        "Sua senha precisa ter pelo menos 6 caracteres."
      );
      return;
    }

    if (senha !== confirmarSenha) {
      Alert.alert(
        "Senhas diferentes",
        "Confira se a senha e a confirmação estão iguais."
      );
      return;
    }

    Alert.alert(
      "Cadastro validado!",
      "A tela está pronta. Agora precisamos conectar o cadastro ao Supabase Auth para criar sua conta."
    );
  }

  function voltarLogin() {
    router.replace("/login");
  }

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={[ styles.conteudo, { paddingTop: Math.max(insets.top, 16) + 8, paddingBottom: Math.max(insets.bottom, 20) + 20, },]} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <TouchableOpacity style={styles.botaoVoltar} onPress={voltarLogin} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={23} color={TEXTO} />
            <Text style={styles.textoVoltar}>Voltar ao login</Text>
          </TouchableOpacity>

          <View style={styles.logoContainer}>
            <Image source={require("../../assets/images/Teresa_Silva_logo_transparente.png")} style={styles.logo} resizeMode="contain"/>
          </View>
          <View style={styles.cabecalho}>
            <Text style={styles.titulo}>Crie sua conta 🌸</Text>
            <Text style={styles.subtitulo}>
              Organize seu salão, seus clientes e seus
              agendamentos em um só lugar.
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>Nome completo</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={21} color={COR_BOTAO}/>
              <TextInput
                style={styles.input}
                placeholder="Como podemos te chamar?"
                placeholderTextColor="#A49A95"
                value={nome}
                onChangeText={setNome}
                autoCapitalize="words"
                autoComplete="name"
                returnKeyType="next" />
            </View>

            <Text style={styles.label}>E-mail</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={21} color={COR_BOTAO}/>
              <TextInput
                style={styles.input}
                placeholder="seuemail@exemplo.com"
                placeholderTextColor="#A49A95"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                returnKeyType="next" />
            </View>

            <Text style={styles.label}>Telefone</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="call-outline" size={21} color={COR_BOTAO}/>
              <TextInput
                style={styles.input}
                placeholder="(00) 00000-0000"
                placeholderTextColor="#A49A95"
                value={telefone}
                onChangeText={setTelefone}
                keyboardType="phone-pad"
                autoComplete="tel"
                returnKeyType="next" />
            </View>

            <Text style={styles.label}>Senha</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={21} color={COR_BOTAO}/>
              <TextInput
                style={styles.input}
                placeholder="Crie uma senha"
                placeholderTextColor="#A49A95"
                value={senha}
                onChangeText={setSenha}
                secureTextEntry={!mostrarSenha}
                autoCapitalize="none"
                autoComplete="new-password"
                returnKeyType="next" />
              <TouchableOpacity onPress={() => setMostrarSenha(!mostrarSenha)} accessibilityLabel={ mostrarSenha ? "Ocultar senha" : "Mostrar senha" }>
                <Ionicons name={mostrarSenha ? "eye-off-outline" : "eye-outline"} size={21} color="#8D817B"/>
              </TouchableOpacity>
            </View>

            <Text style={styles.dicaSenha}>
              Utilize pelo menos 6 caracteres.
            </Text>
            <Text style={styles.label}>Confirmar senha</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="shield-checkmark-outline" size={21} color={COR_BOTAO}/>
              <TextInput
                style={styles.input}
                placeholder="Digite a senha novamente"
                placeholderTextColor="#A49A95"
                value={confirmarSenha}
                onChangeText={setConfirmarSenha}
                secureTextEntry={!mostrarConfirmacao}
                autoCapitalize="none"
                autoComplete="new-password"
                returnKeyType="done"
                onSubmitEditing={cadastrar}/>
              <TouchableOpacity onPress={() => setMostrarConfirmacao(!mostrarConfirmacao) } accessibilityLabel={ mostrarConfirmacao ? "Ocultar confirmação" : "Mostrar confirmação" }>
                <Ionicons name={ mostrarConfirmacao ? "eye-off-outline" : "eye-outline" } size={21} color="#8D817B"/>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.botaoCadastrar} onPress={() => router.push("/cadastro-salvo")} activeOpacity={0.85}>
              <Text style={styles.textoBotaoCadastrar}>
                Criar minha conta
              </Text>
              <Ionicons name="arrow-forward" size={20} color={BRANCO}/>
            </TouchableOpacity>

            <View style={styles.loginContainer}>
              <Text style={styles.textoLogin}>
                Já possui uma conta?
              </Text>
              <TouchableOpacity onPress={voltarLogin} activeOpacity={0.7}>
                <Text style={styles.linkLogin}>Entrar</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.rodape}>
            <Ionicons name="heart" size={15} color={COR_BOTAO} />
            <Text style={styles.textoRodape}>
              Feito com carinho para você
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },

  container: {
    flex: 1,
    backgroundColor: FUNDO,
  },

  conteudo: {
    flexGrow: 1,
    paddingHorizontal: 25,
  },

  botaoVoltar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    alignSelf: "flex-start",
    paddingVertical: 8,
    marginBottom: 8,
  },

  textoVoltar: {
    color: TEXTO,
    fontSize: 14,
    fontWeight: "600",
  },

  logoContainer: {
    alignItems: "center",
    marginBottom: 10,
  },

  logo: {
    width: 300,
    height: 300,
    top: -70,
    marginBottom: -150
  },

  cabecalho: {
    alignItems: "center",
    marginBottom: 22,
  },

  titulo: {
    fontSize: 27,
    fontWeight: "800",
    color: TEXTO,
    textAlign: "center",
    marginBottom: 9,
  },

  subtitulo: {
    fontSize: 14,
    lineHeight: 21,
    color: "#756A64",
    textAlign: "center",
    maxWidth: 310,
  },

  card: {
    backgroundColor: BRANCO,
    borderRadius: 25,
    padding: 22,
    borderWidth: 1,
    borderColor: "#F0E3DD",
    shadowColor: "#8D6254",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 4,
  },

  label: {
    fontSize: 14,
    fontWeight: "700",
    color: TEXTO,
    marginBottom: 8,
    marginTop: 4,
  },

  inputContainer: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FCF8F6",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#EDE0DA",
    paddingHorizontal: 13,
    marginBottom: 16,
    gap: 10,
  },

  input: {
    flex: 1,
    color: TEXTO,
    fontSize: 14,
    paddingVertical: 11,
  },

  dicaSenha: {
    color: "#92847D",
    fontSize: 12,
    marginTop: -10,
    marginBottom: 13,
  },

  botaoCadastrar: {
    minHeight: 54,
    backgroundColor: "#DC4881",
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginTop: 9,
    shadowColor: COR_BOTAO,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 7,
    elevation: 3,
  },

  textoBotaoCadastrar: {
    color: BRANCO,
    fontSize: 16,
    fontWeight: "800",
  },

  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 5,
    marginTop: 23,
  },

  textoLogin: {
    color: "#756A64",
    fontSize: 13,
  },

  linkLogin: {
    color: "#B66D58",
    fontSize: 14,
    fontWeight: "800",
  },

  rodape: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    marginTop: 23,
  },

  textoRodape: {
    color: "#92847D",
    fontSize: 12,
  },
});
