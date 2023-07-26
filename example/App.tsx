/* eslint-disable prettier/prettier */
/**
 * Sample BLE React Native App
 */

import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  NativeModules,
  NativeEventEmitter,
  Platform,
  PermissionsAndroid,
  FlatList,
  TouchableHighlight,
  Pressable,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';

import { BleSingleton } from './src/BleSingleton';

const SECONDS_TO_SCAN_FOR = 7;
const SERVICE_UUIDS: string[] = [];
const ALLOW_DUPLICATES = true;

import BleManager, {
  BleDisconnectPeripheralEvent,
  BleManagerDidUpdateValueForCharacteristicEvent,
  BleScanCallbackType,
  BleScanMatchMode,
  BleScanMode,
  Peripheral,
} from 'react-native-ble-manager';
import { CapteurCard } from './src/CapteurCard';
const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const CHAR_FREQ_AD_UUID = '75b54907-36e1-4688-b7f5-ea07361c56a8';
const CHAR_FREQ_IMU_UUID = '75b54901-36e1-4688-b7f5-ea07361c56a8';
const CHAR_BUFF_AD_UUID = '75b54908-36e1-4688-b7f5-ea07361c56a8';
const CHAR_BUFF_IMU_UUID = '75b54902-36e1-4688-b7f5-ea07361c56a8';
const CHAR_AD_EN = '25b54802-36e1-4688-b7f5-ea07361c56a8';
const CHAR_AD_UUID = '25b54801-36e1-4688-b7f5-ea07361c56a8';

const CONFIG_SERVICE_UUID = '75b54900-36e1-4688-b7f5-ea07361c56a8'
const AD8232_SERVICE_UUID = '25b54800-36e1-4688-b7f5-ea07361c56a8'



const App = () => {
  const [isScanning, setIsScanning] = useState(false);


  const [isGettingData, setIsGettingData] = useState(false);

  const singleton = BleSingleton.get();



  




  const [peripherals, setPeripherals] = useState(
    new Map<Peripheral['id'], Peripheral>(),
  );


  // console.debug('peripherals map updated', [...peripherals.entries()]);

  const addOrUpdatePeripheral = (id: string, updatedPeripheral: Peripheral) => {
    // new Map() enables changing the reference & refreshing UI.
    // TOFIX not efficient.
    setPeripherals(map => new Map(map.set(id, updatedPeripheral)));
  };

  const startScan = () => {
    if (!isScanning) {
      // reset found peripherals before scan
      setPeripherals(new Map<Peripheral['id'], Peripheral>());

      try {
        console.debug('[startScan] starting scan...');
        setIsScanning(true);
        BleManager.scan(SERVICE_UUIDS, SECONDS_TO_SCAN_FOR, ALLOW_DUPLICATES, {
          matchMode: BleScanMatchMode.Sticky,
          scanMode: BleScanMode.LowLatency,
          callbackType: BleScanCallbackType.AllMatches,
        })
          .then(() => {
            console.debug('[startScan] scan promise returned successfully.');
          })
          .catch(err => {
            console.error('[startScan] ble scan returned in error', err);
          });
      } catch (error) {
        console.error('[startScan] ble scan error thrown', error);
      }
    }
  };

  const handleStopScan = () => {
    setIsScanning(false);
    console.debug('[handleStopScan] scan is stopped.');
  };

  const handleDisconnectedPeripheral = (
    event: BleDisconnectPeripheralEvent,
  ) => {
    let peripheral = peripherals.get(event.peripheral);
    if (peripheral) {
      console.debug(
        `[handleDisconnectedPeripheral][${peripheral.id}] previously connected peripheral is disconnected.`,
        event.peripheral,
      );
      addOrUpdatePeripheral(peripheral.id, {...peripheral, connected: false});
    }
    console.debug(
      `[handleDisconnectedPeripheral][${event.peripheral}] disconnected.`,
    );
  };

  const handleUpdateValueForCharacteristic = (
    data: BleManagerDidUpdateValueForCharacteristicEvent,
  ) => {
     if(data.peripheral === 'C8:F0:9E:70:FE:06'){
      singleton.capteur(0).setValue(data.value);
    }


    else if (data.peripheral === 'C8:F0:9E:70:FA:96' ) {
      singleton.capteur(1).setValue(data.value);
   }


    else if (data.peripheral === 'C8:F0:9E:78:A2:D2' ){
      singleton.capteur(2).setValue(data.value);
   }

    else if (data.peripheral === 'C8:F0:9E:70:FD:C6' ){
      singleton.capteur(3).setValue(data.value);
   }

    else if (data.peripheral === 'C8:F0:9E:70:FE:1E' ){
      singleton.capteur(4).setValue(data.value);
   }

    else if (data.peripheral === 'C8:F0:9E:70:FA:C2' ){
      singleton.capteur(5).setValue(data.value);
    }

    
    /*console.debug(
      `[handleUpdateValueForCharacteristic] received data from '${data.peripheral}' with characteristic='${data.characteristic}' and value='${data.value}'`,
    ); */

    
  };

  const handleDiscoverPeripheral = (peripheral: Peripheral) => {
    console.debug('[handleDiscoverPeripheral] new BLE peripheral=', peripheral);
    if (!peripheral.name) {
      peripheral.name = 'NO NAME';
    }
    addOrUpdatePeripheral(peripheral.id, peripheral);
  };

  const togglePeripheralConnection = async (peripheral: Peripheral) => {
    if (peripheral && peripheral.connected) {
      /*
      try {

        
        console.log('try' + peripheral.id);
        // Before startNotification you need to call retrieveServices
        const peripheralInfo = await BleManager.retrieveServices(peripheral.id);
        console.log('retrieveServices', peripheralInfo.services);


        await BleManager.write(peripheral.id, CONFIG_SERVICE_UUID, CHAR_FREQ_AD_UUID , [0x31]  );
        console.log('Write to CHAR_FREQ_AD_UUID');
        await BleManager.write(peripheral.id, CONFIG_SERVICE_UUID, CHAR_FREQ_IMU_UUID  , [0x31]  );
        console.log('Write to CHAR_FREQ_IMU_UUID');
        await BleManager.write(peripheral.id, CONFIG_SERVICE_UUID, CHAR_BUFF_AD_UUID   , [0x31, 0x30]  );
        console.log('Write to CHAR_BUFF_AD_UUID');
        await BleManager.write(peripheral.id, CONFIG_SERVICE_UUID, CHAR_BUFF_IMU_UUID    , [0x35, 0x30]  );
        console.log('Write to CHAR_BUFF_IMU_UUID');
        await BleManager.write(peripheral.id, AD8232_SERVICE_UUID, CHAR_AD_EN    , [0x31]  );
        console.log('Write to CHAR_AD_EN');

        const data = await BleManager.read(peripheral.id, AD8232_SERVICE_UUID, CHAR_AD_UUID);
        console.log('read', data);

        /* await BleManager.startNotification(peripheral.id, 'test', 'characteristic');
        console.log('Started notification on ' + peripheral.id); */


        // To enable BleManagerDidUpdateValueForCharacteristic listener
        /*
        await BleManager.startNotification(peripheral.id, 'test', 'characteristic');
        console.log('Started notification on ' + peripheral.id);
    
        await BleManager.write(peripheral.id, 'service', 'characteristic', [1]);
        console.log('Write to peripheral');
        
      } catch (err) {
        console.log(err);
      }*/

      

      
      try {
        
        await BleManager.disconnect(peripheral.id);
      } catch (error) {
        console.error(
          `[togglePeripheralConnection][${peripheral.id}] error when trying to disconnect device.`,
          error,
        );
      }
    } else {
      await connectPeripheral(peripheral);
    }
  };

  const retrieveConnected = async () => {
    try {
      const connectedPeripherals = await BleManager.getConnectedPeripherals();
      if (connectedPeripherals.length === 0) {
        console.warn('[retrieveConnected] No connected peripherals found.');
        return;
      }

      console.debug(
        '[retrieveConnected] connectedPeripherals',
        connectedPeripherals,
      );

      for (var i = 0; i < connectedPeripherals.length; i++) {
        var peripheral = connectedPeripherals[i];
        addOrUpdatePeripheral(peripheral.id, {...peripheral, connected: true});
      }
    } catch (error) {
      console.error(
        '[retrieveConnected] unable to retrieve connected peripherals.',
        error,
      );
    }
  };

  const connectPeripheral = async (peripheral: Peripheral) => {
    try {
      if (peripheral) {
        addOrUpdatePeripheral(peripheral.id, {...peripheral, connecting: true});

        await BleManager.connect(peripheral.id);
        console.debug(`[connectPeripheral][${peripheral.id}] connected.`);

        addOrUpdatePeripheral(peripheral.id, {
          ...peripheral,
          connecting: false,
          connected: true,
        });

        // before retrieving services, it is often a good idea to let bonding & connection finish properly
        await sleep(900);

        /* Test read current RSSI value, retrieve services first */
        const peripheralData = await BleManager.retrieveServices(peripheral.id);
        console.debug(
          `[connectPeripheral][${peripheral.id}] retrieved peripheral services`,
          peripheralData,
        );

        const rssi = await BleManager.readRSSI(peripheral.id);
        console.debug(
          `[connectPeripheral][${peripheral.id}] retrieved current RSSI value: ${rssi}.`,
        );

        if (peripheralData.characteristics) {
          for (let characteristic of peripheralData.characteristics) {
            if (characteristic.descriptors) {
              for (let descriptor of characteristic.descriptors) {
                try {
                  let data = await BleManager.readDescriptor(
                    peripheral.id,
                    characteristic.service,
                    characteristic.characteristic,
                    descriptor.uuid,
                  );
                  console.debug(
                    `[connectPeripheral][${peripheral.id}] descriptor read as:`,
                    data,
                  );
                } catch (error) {
                  console.error(
                    `[connectPeripheral][${peripheral.id}] failed to retrieve descriptor ${descriptor} for characteristic ${characteristic}:`,
                    error,
                  );
                }
              }
            }
          }
        }

        let p = peripherals.get(peripheral.id);
        if (p) {
          addOrUpdatePeripheral(peripheral.id, {...peripheral, rssi});
        }
      }
    } catch (error) {
      console.error(
        `[connectPeripheral][${peripheral.id}] connectPeripheral error`,
        error,
      );
    }
  };

  function sleep(ms: number) {
    return new Promise<void>(resolve => setTimeout(resolve, ms));
  }

  useEffect(() => {
    try {
      BleManager.start({showAlert: false})
        .then(() => console.debug('BleManager started.'))
        .catch(error  =>
          console.error('BeManager could not be started.', error),
        );
    } catch (error) {
      console.error('unexpected error starting BleManager.', error);
      return;
    }

    const listeners = [
      bleManagerEmitter.addListener(
        'BleManagerDiscoverPeripheral',
        handleDiscoverPeripheral,
      ),
      bleManagerEmitter.addListener('BleManagerStopScan', handleStopScan),
      bleManagerEmitter.addListener(
        'BleManagerDisconnectPeripheral',
        handleDisconnectedPeripheral,
      ),
      bleManagerEmitter.addListener(
        'BleManagerDidUpdateValueForCharacteristic',
        handleUpdateValueForCharacteristic,
      ),
    ];

    handleAndroidPermissions();

    return () => {
      console.debug('[app] main component unmounting. Removing listeners...');
      for (const listener of listeners) {
        listener.remove();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const handleAndroidPermissions = () => {
    if (Platform.OS === 'android' && Platform.Version >= 31) {
      PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      ]).then(result => {
        if (result) {
          console.debug(
            '[handleAndroidPermissions] User accepts runtime permissions android 12+',
          );
        } else {
          console.error(
            '[handleAndroidPermissions] User refuses runtime permissions android 12+',
          );
        }
      });
    } else if (Platform.OS === 'android' && Platform.Version >= 23) {
      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ).then(checkResult => {
        if (checkResult) {
          console.debug(
            '[handleAndroidPermissions] runtime permission Android <12 already OK',
          );
        } else {
          PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          ).then(requestResult => {
            if (requestResult) {
              console.debug(
                '[handleAndroidPermissions] User accepts runtime permission android <12',
              );
            } else {
              console.error(
                '[handleAndroidPermissions] User refuses runtime permission android <12',
              );
            }
          });
        }
      });
    }
  };

  const renderItem = ({item}: {item: Peripheral}) => {
    const backgroundColor = item.connected ? '#069400' : Colors.white;

    const index = Array.from(peripherals.values()).indexOf(item);
    return (

      <TouchableHighlight
        underlayColor="#0082FC"
        onPress={() => togglePeripheralConnection(item)}>
        <CapteurCard item={item} index={index} />
      </TouchableHighlight>
    );
  };


  const getDataContinus = async () => {


    const connectedPeripherals = await BleManager.getConnectedPeripherals();


    

    for(const peripheral of connectedPeripherals){

      // RETRIEVE AVANT LE FOR ?

      BleManager.retrieveServices(peripheral.id).then(() => {
        BleManager.startNotification(peripheral.id, AD8232_SERVICE_UUID, CHAR_AD_UUID).then(() => {
          console.log('Notification started');
        })
        .catch((error : any) => {
          console.log('Notification error', error);

        })


      })

    
    }
  }

  const configureData = async () => {
    setIsGettingData(true);
    try {
      const connectedPeripherals = await BleManager.getConnectedPeripherals();
      for(const peripheral of connectedPeripherals){

        

        console.log(peripheral);
        
        const peripheralInfo = await BleManager.retrieveServices(peripheral.id);
        console.log('retrieveServices', peripheralInfo.services);


        await BleManager.write(peripheral.id, CONFIG_SERVICE_UUID, CHAR_FREQ_AD_UUID , [0x31]  );
        console.log('Write to CHAR_FREQ_AD_UUID');
        await BleManager.write(peripheral.id, CONFIG_SERVICE_UUID, CHAR_FREQ_IMU_UUID  , [0x31]  );
        console.log('Write to CHAR_FREQ_IMU_UUID');
        await BleManager.write(peripheral.id, CONFIG_SERVICE_UUID, CHAR_BUFF_AD_UUID   , [0x31, 0x36]  );
        console.log('Write to CHAR_BUFF_AD_UUID');
        await BleManager.write(peripheral.id, CONFIG_SERVICE_UUID, CHAR_BUFF_IMU_UUID    , [0x31, 0x36]  );
        console.log('Write to CHAR_BUFF_IMU_UUID');
        await BleManager.write(peripheral.id, AD8232_SERVICE_UUID, CHAR_AD_EN    , [0x31]  );
        console.log('Write to CHAR_AD_EN');

        await BleManager.requestMTU(peripheral.id, 27);


      

        /* const data = await BleManager.startNotification(peripheral.id, AD8232_SERVICE_UUID, CHAR_AD_UUID);
        console.log('read', data);



        sleep(1000)

        await BleManager.stopNotification(peripheral.id, AD8232_SERVICE_UUID, CHAR_AD_UUID); */
        
        
      }
    }
    catch(error){
      console.log('error', error);
    }

  };

  return (
    <>
      <StatusBar />
      <SafeAreaView style={styles.body}>


      <Pressable style={styles.scanButton} onPress={getDataContinus}>
          <Text style={styles.scanButtonText}>
            {'get data continuous'}
          </Text>
        </Pressable>
        <Pressable style={styles.scanButton} onPress={configureData}>
          <Text style={styles.scanButtonText}>
            {'REGLAGE '}
          </Text>
        </Pressable>
        <Pressable style={styles.scanButton} onPress={startScan}>
          <Text style={styles.scanButtonText}>
            {isScanning ? 'Scanning...' : 'Scan Bluetooth'}
          </Text>
        </Pressable>

        <Pressable style={styles.scanButton} onPress={retrieveConnected}>
          <Text style={styles.scanButtonText}>
            {'Retrieve connected peripherals'}
          </Text>
        </Pressable>

        {Array.from(peripherals.values()).length === 0 && (
          <View style={styles.row}>
            <Text style={styles.noPeripherals}>
              No Peripherals, press "Scan Bluetooth" above.
            </Text>
          </View>
        )}

        <FlatList
          data={Array.from(peripherals.values())}
          contentContainerStyle={{rowGap: 12}}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      </SafeAreaView>
    </>
  );
};

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

export default App;
