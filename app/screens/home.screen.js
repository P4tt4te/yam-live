import { useEffect, useState } from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import io from "socket.io-client";
import Engine from "../components/engine.component";

// Replace this URL with your own socket-io host, or start the backend locally
const socketEndpoint = "http://10.60.104.103:3000";

export default function HomeScreen({ navigation }) {
  const [hasConnection, setConnection] = useState(false);
  const [time, setTime] = useState(null);

  useEffect(function didMount() {
    const socket = io(socketEndpoint, {
      transports: ["websocket"],
    });

    socket.io.on("open", () => setConnection(true));
    socket.io.on("close", () => setConnection(false));

    socket.on("time-msg", (data) => {
      setTime(new Date(data.time).toString());
    });

    return function didUnmount() {
      socket.disconnect();
      socket.removeAllListeners();
    };
  }, []);

  /*
  return (
    <View style={styles.container}>
      {!hasConnection && (
        <>
          <Text style={styles.paragraph}>
            Connecting to {socketEndpoint}...
          </Text>
          <Text style={styles.footnote}>
            Make sure the backend is started and reachable
          </Text>
        </>
      )}

      {hasConnection && (
        <>
          <Text style={[styles.paragraph, { fontWeight: "bold" }]}>
            Server time
          </Text>
          <Text style={styles.paragraph}>{time}</Text>
        </>
      )}
    </View>
  );
  <View style={{ height: 300, backgroundColor: "black", width: 300 }}>
        <Engine />
    </View>
  */

  return (
    <View style={styles.container}>
      
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
