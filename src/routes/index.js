import { NavigationContainer } from '@react-navigation/native';
// import { CompanyScreen } from '../pages/empresa/index'; // Removido: Já está dentro da rota 'Home' (Tab Navigator)
import { CarDetailsScreen } from '../pages/detalhes/detalhes'; 
// >>>>>>>>>>>>>>>>> 1. NOVO IMPORT PARA A TELA DE FINANCIAMENTO <<<<<<<<<<<<<<<<<
import { FinancingScreen } from '../pages/calcular/FinancingCalculator'; 

import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

import { Login } from '../pages/login/index';
import { CreateAccount } from '../pages/createAccount/index';
import { Home } from '../pages/home/index';

export function AppRoutes() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}>
        
        <Stack.Screen name="Login" component={Login} />

        <Stack.Screen name="CreateAccount" component={CreateAccount} />

        <Stack.Screen name="Home" component={Home} />
        
        <Stack.Screen name="Detalhes" component={CarDetailsScreen} /> 
        
        {/* >>>>>>>>>>>>>>>>> 2. NOVA ROTA DE FINANCIAMENTO ADICIONADA <<<<<<<<<<<<<<<<< */}
        {/* O nome "Financiamento" DEVE ser o mesmo usado no navigation.navigate da tela Detalhes */}
        <Stack.Screen name="Financiamento" component={FinancingScreen} />
        
        {/* <Stack.Screen name="CompanyScreen" component={CompanyScreen} /> // Removido: Está dentro do Tab Navigator de 'Home' */}
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}