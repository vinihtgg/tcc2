import {
  ScrollView,
  StyleSheet,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import logo from '../../assets/autosmart.png';

export function CreateAccount() {
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={{ flexGrow: 1 }}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.backButton}>Voltar</Text>
      </TouchableOpacity>

      <Image source={logo} style={styles.logo} />

      <Text style={styles.title}>
        Bem-vindo à <Text style={styles.highlight}>Auto Smart</Text>
        {'\n'} ↳ Crie sua Conta ↲
      </Text>

      {/* Nome */}
      <View style={styles.inputWrapper}>
        <Ionicons name="person-outline" size={20} color="#6b7280" style={styles.icon} />
        <TextInput
          placeholder="Seu nome"
          placeholderTextColor="#6b7280"
          style={styles.inputControl}
          underlineColorAndroid="transparent"
        />
      </View>

      {/* Email */}
      <View style={styles.inputWrapper}>
        <Ionicons name="mail-outline" size={20} color="#6b7280" style={styles.icon} />
        <TextInput
          placeholder="email@exemplo.com"
          placeholderTextColor="#6b7280"
          keyboardType="email-address"
          style={styles.inputControl}
          underlineColorAndroid="transparent"
        />
      </View>

      {/* Senha */}
      <View style={styles.inputWrapper}>
        <Ionicons name="lock-closed-outline" size={20} color="#6b7280" style={styles.icon} />
        <TextInput
          placeholder="**********"
          placeholderTextColor="#6b7280"
          secureTextEntry
          style={styles.inputControl}
          underlineColorAndroid="transparent"
        />
      </View>

      {/* Telefone */}
      <View style={styles.inputWrapper}>
        <Ionicons name="call-outline" size={20} color="#6b7280" style={styles.icon} />
        <TextInput
          placeholder="(00) 00000-0000"
          placeholderTextColor="#6b7280"
          keyboardType="phone-pad"
          style={styles.inputControl}
          underlineColorAndroid="transparent"
        />
      </View>

      {/* Botão */}
      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <View style={styles.button}>
          <Text style={styles.textButton}>Criar</Text>
        </View>
      </TouchableOpacity>

      {/* Link para login */}
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginLink}>
          Já possui conta? <Text style={styles.loginHighlight}>Faça Login</Text>
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#f0f4f8',
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  backButton: {
    color: '#075EEC',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 20,
  },
  logo: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginBottom: 30,
    marginTop: 20,
    resizeMode: 'contain',
  },
  title: {
    textAlign: 'center',
    fontSize: 28,
    lineHeight: 34,
    fontWeight: 'bold',
    color: '#1D2A32',
    marginBottom: 24,
  },
  highlight: {
    color: '#FFD700',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#C9D2DB',
    marginVertical: 8,
    paddingHorizontal: 12,
    height: 50,
  },
  icon: {
    marginRight: 8,
  },
  inputControl: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: '#222',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#075eec',
    borderRadius: 30,
    paddingVertical: 14,
    marginVertical: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    elevation: 4,
  },
  textButton: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 17,
  },
  loginLink: {
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    marginVertical: 8,
    color: '#1D2A32',
  },
  loginHighlight: {
    color: '#075EEC',
    fontWeight: 'bold',
  },
});