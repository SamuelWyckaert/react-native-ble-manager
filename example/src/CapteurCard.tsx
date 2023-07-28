import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableHighlight, View } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { BleSingleton } from "./BleSingleton";
import { Chart, VerticalAxis, HorizontalAxis, Line } from 'react-native-responsive-linechart'

import {
  SciChartSurface,
  NumericAxis,
  FastLineRenderableSeries,
  XyDataSeries,
  EllipsePointMarker,
  SweepAnimation,
  SciChartJsNavyTheme,
  NumberRange
} from "scichart";


interface CapteurCardProps {
    name: string;
    item: any;
    isCapteur: boolean;
}

export const CapteurCard = (props: CapteurCardProps) => {

    const { item, name, isCapteur } = props;

    const [count , setCount] = useState(0);

    const capteur = BleSingleton.get().capteur(name);




    if(isCapteur && capteur) {
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
          <Text> Nombre de trames par secondes :  { isCapteur && capteur && capteur.getTramesPerSecond()}</Text>


            
            <View id="scichart-root" style={{ maxWidth: 900 }} />
                          


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
  