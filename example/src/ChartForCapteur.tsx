import React, { useState } from 'react'; 
import { useEffect } from 'react'; 
import { LineChart } from 'react-native-chart-kit'; 
import { BleSingleton } from './BleSingleton'; 
 
 
interface ChartForCapteurProps { 
    index: number, 
} 

 
export const ChartForCapteur = (props: ChartForCapteurProps) => { 
 
    const { index } = props; 

    const [count , setCount] = useState(0); 

    const capteur = BleSingleton.get().capteur(index); 

    const data = { 
        labels: ["January", "February", "March", "April", "May", "June"], 
        datasets: [ 
          { 
             data: [capteur.value[0] ?? 0, capteur.value[1] ?? 0, capteur.value[2] ?? 0, capteur.value[3] ?? 0, capteur.value[4] ?? 0, capteur.value[5] ?? 0],
             color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
             strokeWidth: 2 // optional
          } 
        ], 
        legend: ["Rainy Days"] // optional 
      }; 
 
      capteur.callback = () => { 
        setCount(count + 1); 
    } 
 
    return ( 
 
        <LineChart 
            data={data} 
            width={400} 
            height={220} 
            chartConfig={{ 
                backgroundColor: "#e26a00", 
                backgroundGradientFrom: "#fb8c00", 
                backgroundGradientTo: "#ffa726", 
                decimalPlaces: 0, // optional, defaults to 2dp 
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, 
                style: { 
                borderRadius: 16 
                } 
            }} 
            /> 
        

    )
}


