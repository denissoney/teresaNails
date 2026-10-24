import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function MenuDrawer({ visible, onClose }: Props) {
  const router = useRouter();

  function go(path: string) {
    onClose();
    setTimeout(() => router.push(path as any), 200);
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.drawer}>
          {/* HEADER LOGO */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Ionicons name="close" size={22} color="#000" />
            </TouchableOpacity>
            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>S</Text>
            </View>
            <Text style={styles.nome}>TERESA SILVA</Text>
            <Text style={styles.subNome}>Nails Designer</Text>
          </View>

          {/* ITENS */}
          <View style={styles.menu}>
            <TouchableOpacity style={styles.item} onPress={() => go("/home")}>
              <Ionicons name="home" size={20} color="#000" />
              <Text style={styles.itemTexto}>Home</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.item} onPress={() => go("/agenda")}>
              <Ionicons name="calendar-outline" size={20} color="#000" />
              <Text style={styles.itemTexto}>Agenda</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.item, styles.itemAtivo]} onPress={() => go("/clientes")}>
              <Ionicons name="people-outline" size={20} color="#000" />
              <Text style={[styles.itemTexto, styles.itemTextoAtivo]}>Clientes</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.item} onPress={() => go("/financeiro")}>
              <Ionicons name="image-outline" size={20} color="#000" />
              <Text style={styles.itemTexto}>Financeiro</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.item} onPress={() => go("/perfil")}>
              <Ionicons name="person-outline" size={20} color="#000" />
              <Text style={styles.itemTexto}>Perfil</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.item} onPress={() => go("/servicos")}>
              <Text style={styles.emoji}>✂️</Text>
              <Text style={styles.itemTexto}>Serviços</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.item} onPress={() => go("/pagamento")}>
              <Ionicons name="card-outline" size={20} color="#000" />
              <Text style={styles.itemTexto}>Pagamento</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.item} onPress={() => go("/mais")}>
              <Ionicons name="settings-outline" size={20} color="#000" />
              <Text style={styles.itemTexto}>configurações</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.item} onPress={() => go("/sobre")}>
              <Ionicons name="information-circle-outline" size={20} color="#000"/>
              <Text style={styles.itemTexto}>Sobre</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.item, styles.itemSair]} onPress={() => go("/")}>
              <Ionicons name="exit-outline" size={20} color="#E65100" />
              <Text style={styles.itemSairTexto}>Sair</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, flexDirection: "row" },
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.3)" },
  drawer: { width: "75%", maxWidth: 300, backgroundColor: "#fff", height: "100%", borderTopRightRadius: 0, borderBottomRightRadius: 0, overflow: "hidden", borderWidth: 2, borderColor: "#2B7FFF" },
  header: { backgroundColor: "#FFF8F5", alignItems: "center", paddingTop: 14, paddingBottom: 20, borderBottomWidth: 1, borderColor: "#eee" },
  closeBtn: { position: "absolute", top: 10, right: 10, width: 32, height: 32, alignItems: "center", justifyContent: "center", zIndex: 10 },
  logoCircle: { width: 56, height: 56, borderRadius: 28, borderWidth: 1.5, borderColor: "#C9A86A", alignItems: "center", justifyContent: "center", marginTop: 10 },
  logoText: { fontSize: 30, fontFamily: "serif", color: "#C9A86A", fontStyle: "italic" },
  nome: { marginTop: 8, fontSize: 18, letterSpacing: 2, fontWeight: "400", color: "#C9A86A" },
  subNome: { fontSize: 11, letterSpacing: 1, color: "#C9A86A", marginTop: 2 },
  menu: { flex: 1, paddingTop: 12, paddingHorizontal: 10, backgroundColor: "#fff" },
  item: { flexDirection: "row", alignItems: "center", paddingVertical: 12, paddingHorizontal: 10, borderRadius: 8, gap: 12 },
  itemAtivo: { backgroundColor: "#FFE8DF" },
  itemTexto: { fontSize: 14, fontWeight: "500", color: "#000" },
  itemTextoAtivo: { fontWeight: "700" },
  emoji: { fontSize: 18, width: 20, textAlign: "center" },
  itemSair: { marginTop: 10 },
  itemSairTexto: { fontSize: 14, fontWeight: "600", color: "#E65100" },
});