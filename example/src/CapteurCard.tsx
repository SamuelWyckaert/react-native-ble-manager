import React, { useState } from "react";
import { StyleSheet, Text, TouchableHighlight, View } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { BleSingleton } from "./BleSingleton";
import { Chart, VerticalAxis, HorizontalAxis, Line } from 'react-native-responsive-linechart'


interface CapteurCardProps {
    index: number;
    item: any;
}

export const CapteurCard = (props: CapteurCardProps) => {

    const { item, index } = props;

    const [count , setCount] = useState(0);

    const capteur = BleSingleton.get().capteur(index);

    function isCapteur() {
      return item.id === 'C8:F0:9E:70:FE:06' ||
              item.id === 'C8:F0:9E:70:FA:96' ||
              item.id === 'C8:F0:9E:78:A2:D2' ||
              item.id === 'C8:F0:9E:70:FD:C6' ||
              item.id === 'C8:F0:9E:70:FE:1E' ||
              item.id === 'C8:F0:9E:70:FA:C2' 
              ;
    }


    if(isCapteur()) {
      capteur.callback = () => {
          setCount(count + 1);
      }
    }


    const data = [
      [
        { x: -2, y: 1 },
        { x: -1, y: 0 },
        { x: 8, y: 13 },
        { x: 9, y: 11.5 },
        { x: 10, y: 12 }
      ],
      [
        { x: -2, y: 15 },
        { x: -1, y: 10 },
        { x: 0, y: 12 },
        { x: 1, y: 7 },
        { x: 8, y: 12 },
        { x: 9, y: 13.5 },
        { x: 10, y: 18 }
      ]

    ]
    
    return (
        <View style={[styles.row, ]}>
          <Text style={styles.peripheralName}>
            {/* completeLocalName (item.name) & shortAdvertisingName (advertising.localName) may not always be the same */}
            {item.name} - {item?.advertising?.localName}
            {item.connecting && ' - Connecting...'}
          </Text>
          <Text style={styles.rssi}>RSSI: {item.rssi}</Text>
          <Text style={styles.peripheralId}>{item.id}</Text>
          <Text> Nombre de trames par secondes :  { isCapteur() && BleSingleton.get().capteur(index).getTramesPerSecond()}</Text>


          <Chart
            style={{ height: 200, width: '100%', backgroundColor: '#eee' }}
            xDomain={{ min: -2, max: 10 }}
            yDomain={{ min: -2, max: 20 }}
            padding={{ left: 20, top: 10, bottom: 10, right: 10 }}
          >
            <VerticalAxis tickValues={[0, 4, 8, 12, 16, 20]} />
            <HorizontalAxis tickCount={3} />
            <Line data={data[count % 2]} smoothing="none" theme={{ stroke: { color: 'red', width: 1 } }} />
          </Chart>
                    


        </View>
    )





}

const boxShadow = {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  };
  
  const styles = StyleSheet.create({
    engine: {
      position: 'absolute',
      right: 10,
      bottom: 0,
      color: Colors.black,
    },
    scanButton: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 16,
      backgroundColor: '#0a398a',
      margin: 10,
      borderRadius: 12,
      ...boxShadow,
    },
    scanButtonText: {
      fontSize: 20,
      letterSpacing: 0.25,
      color: Colors.white,
    },
    body: {
      backgroundColor: '#0082FC',
      flex: 1,
    },
    sectionContainer: {
      marginTop: 32,
      paddingHorizontal: 24,
    },
    sectionTitle: {
      fontSize: 24,
      fontWeight: '600',
      color: Colors.black,
    },
    sectionDescription: {
      marginTop: 8,
      fontSize: 18,
      fontWeight: '400',
      color: Colors.dark,
    },
    highlight: {
      fontWeight: '700',
    },
    footer: {
      color: Colors.dark,
      fontSize: 12,
      fontWeight: '600',
      padding: 4,
      paddingRight: 12,
      textAlign: 'right',
    },
    peripheralName: {
      fontSize: 16,
      textAlign: 'center',
      padding: 10,
    },
    rssi: {
      fontSize: 12,
      textAlign: 'center',
      padding: 2,
    },
    peripheralId: {
      fontSize: 12,
      textAlign: 'center',
      padding: 2,
      paddingBottom: 20,
    },
    row: {
      marginLeft: 10,
      marginRight: 10,
      borderRadius: 20,
      ...boxShadow,
    },
    noPeripherals: {
      margin: 10,
      textAlign: 'center',
      color: Colors.white,
    },
  });
  