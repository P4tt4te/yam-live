import { StyleSheet, View, Button } from "react-native";
import Engine from "../components/engine.component";

const enableEngine = false;

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      {enableEngine && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "black",
          }}
        >
          <Engine />
        </View>
      )}
      <View>
        <Button
          title="Jouer en ligne"
          onPress={() => navigation.navigate("OnlineGameScreen")}
        />
      </View>
      <View>
        <Button
          title="Jouer contre le bot"
          onPress={() => navigation.navigate("VsBotGameScreen")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
