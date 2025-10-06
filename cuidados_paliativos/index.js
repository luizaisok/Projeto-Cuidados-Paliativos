import { registerRootComponent } from 'expo';

import App from './App';

// import Duvidas from "./src/pages/Duvidas"; // só para testes
import TelaAmarela from "./src/pages/TelaAmarela"; // só para testes

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
// registerRootComponent(App);
// registerRootComponent(Duvidas); // só para testes
registerRootComponent(TelaAmarela); // só para testes
