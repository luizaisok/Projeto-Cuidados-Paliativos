import { registerRootComponent } from 'expo';

import Rotas from './src/routes/Rotas';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(Rotas);
