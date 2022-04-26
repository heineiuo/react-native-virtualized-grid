import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TouchableOpacity, View, Linking, Text } from "react-native";

export function Header() {
  return (
    <View
      style={{
        height: 56,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <View style={{ paddingLeft: 20 }}>
        <Text style={{ fontWeight: "bold", fontSize: 20 }}>
          React Native Virtualized Grid
        </Text>
      </View>
      <View
        style={{ paddingRight: 20, flexDirection: "row", alignItems: "center" }}
      >
        <TouchableOpacity
          style={{ marginRight: 12 }}
          onPress={() => {
            Linking.openURL("https://twitter.com/770hz");
          }}
        >
          <MaterialCommunityIcons name="twitter" size={24} color="#1d9bf0" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            Linking.openURL(
              "https://github.com/heineiuo/react-native-virtualized-grid"
            );
          }}
        >
          <MaterialCommunityIcons name="github" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
