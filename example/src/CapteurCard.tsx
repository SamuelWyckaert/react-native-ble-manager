import React, { useState } from "react";
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

    async function initSciChart() {
      // LICENSING
      // Commercial licenses set your license code here
      // Purchased license keys can be viewed at https://www.scichart.com/profile
      // How-to steps at https://www.scichart.com/licensing-scichart-js/
      // SciChartSurface.setRuntimeLicenseKey("YOUR_RUNTIME_KEY");
    
      // Initialize SciChartSurface. Don't forget to await!
      const { sciChartSurface, wasmContext } = await SciChartSurface.create("scichart-root", {
        theme: new SciChartJsNavyTheme(),
        title: "SciChart.js First Chart",
        titleStyle: { fontSize: 22 }
      });
    
      // Create an XAxis and YAxis with growBy padding
      const growBy = new NumberRange(0.1, 0.1);
      sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { axisTitle: "X Axis", growBy }));
      sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { axisTitle: "Y Axis", growBy }));
    
      // Create a line series with some initial data
      sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, {
        stroke: "steelblue",
        strokeThickness: 3,
        dataSeries: new XyDataSeries(wasmContext, {
          xValues: [0,1,2,3,4,5,6,7,8,9],
          yValues: [0, 0.0998, 0.1986, 0.2955, 0.3894, 0.4794, 0.5646, 0.6442, 0.7173, 0.7833]
        }),
        pointMarker: new EllipsePointMarker(wasmContext, { width: 11, height: 11, fill: "#fff" }),
        animation: new SweepAnimation({ duration: 300, fadeEffect: true })
      }));
    
      return sciChartSurface;
    }
    



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
  