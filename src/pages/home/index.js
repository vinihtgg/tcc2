// ===================== IMPORTS E FUNÇÕES AUXILIARES =====================
import React, { useState, useMemo } from 'react';
import {
  ScrollView,
  StyleSheet,
  Image,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Linking,
  SafeAreaView,
  TextInput,
} from 'react-native';
// IMPORTS DE NAVEGAÇÃO
import { useNavigation, useRoute } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';

// IMPORTS DE OUTROS ARQUIVOS
import { FinancingScreen } from '../calcular/FinancingCalculator'; // <-- NOVO IMPORT

const Tab = createBottomTabNavigator();
const { width } = Dimensions.get('window');

// Função auxiliar para formatar números como moeda BRL (R$)
const formatCurrency = (value) => {
    if (isNaN(value)) return 'R$ 0,00';
    return parseFloat(value).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });
};

// Função auxiliar para remover formatação de preço (R$ 1.200.000,00 -> 1200000.00)
const cleanPrice = (priceString) => {
  if (!priceString) return 0;
  // Remove "R$", pontos de milhar, e substitui vírgula decimal por ponto
  const cleaned = priceString.replace('R$', '').replace(/\./g, '').replace(',', '.').trim();
  return parseFloat(cleaned) || 0;
};


// ===================== IMAGENS E DADOS =====================
import item1 from '../../assets/car1.jpg';
import item2 from '../../assets/car2.jpg';
import item3 from '../../assets/car3.jpg';
import item4 from '../../assets/landrover.jpg';
import item5 from '../../assets/tiguan.jpg';
import item6 from '../../assets/corolla.jpg';
import item7 from '../../assets/fastback.jpg';
import item8 from '../../assets/corollacross.jpg';
import item9 from '../../assets/jeep.jpg';

const destaques = [
  // Item de destaque principal (Audi R8)
  {
    id: 1,
    title: 'AUDI R8',
    description: '5.2 FSI Plus S Tronic Quattro - 2015',
    image: item1,
    ano: '2015',
    km: '24.000',
    price: 'R$ 800.000,00',
  },
];
const carrosSonhos = [
  // COERÊNCIA AJUSTADA: item4 é landrover.jpg
  {
    id: 4,
    title: 'LAND ROVER DISCOVERY SPORT 2.0',
    subtitle: 'TURBO DIESEL R-DYNAMIC SE AUTOMATICO',
    image: item4,
    ano: '2020',
    km: '56.400',
    price: 'R$ 179.900',
    coberto: false,
  },
  // COERÊNCIA AJUSTADA: item5 é tiguan.jpg
  {
    id: 5,
    title: 'VW TIGUAN',
    subtitle: 'ALLSPACE R-LINE 350 TSI',
    image: item5,
    price: 'R$ 150.000',
    coberto: false,
  },
  // COERÊNCIA AJUSTADA: item6 é corolla.jpg
  {
    id: 6,
    title: 'TOYOTA COROLLA',
    subtitle: 'ALTIS PREMIUM 2.0 FLEX AUT',
    image: item6,
    price: 'R$ 110.000',
    coberto: false, // <-- ALTERADO PARA REMOVER O "AGUARDE..."
  },
];
// MUDANÇA AQUI: Adicionando carrosSonhos ao todoEstoque
const todoEstoque = [
  // Carros dos Sonhos
  carrosSonhos[0], // Land Rover
  carrosSonhos[1], // VW Tiguan
  carrosSonhos[2], // Toyota Corolla (agora disponível)

  // Outros Carros
  {
    id: 7,
    title: 'FIAT FASTBACK 1.0 TURBO',
    image: item7,
    ano: '2025',
    km: '15.000',
    description: 'FLEX IMPETUS CVT AUTOMATICO 2025',
    price: 'R$ 125.000',
  },
  {
    id: 8,
    title: 'TOYOTA COROLLA CROSS 2.0',
    image: item8,
    description: 'FLEX DIRECT SHIFT AUTOMATICO 2026',
    price: 'R$ 188.990',
  },
  {
    id: 9,
    title: 'JEEP RENEGADE 1.8 FLEX',
    image: item9,
    description: 'TURBO FLEX LONGITUDE AT6',
    price: 'R$ 135.000',
  },

  // Destaque (Audi R8)
  destaques[0],
];


// ===================== COMPONENTE: HEADER =====================
const HeaderChico = () => (
  <View style={headerStyles.containerCentralized}>
    <View style={headerStyles.logoContainerCentralized}>
      <Text style={headerStyles.logoTextNormal}>AUTO</Text>
      <Text style={headerStyles.logoTextBold}>SMART</Text>
    </View>
  </View>
);

// ===================== COMPONENTE: DESTAQUE PRINCIPAL =====================
const DestacadoSection = () => {
  // 2. USAMOS O HOOK DE NAVEGAÇÃO AQUI
  const navigation = useNavigation();
  const principal = destaques[0];

  // A função agora recebe 'price'
  const formatPriceAndKM = (km, price) => (
    <View style={{ width: '100%', alignItems: 'flex-start' }}>
      {/* Adicionado label para ANO */}
      <Text style={destaqueStyles.infoLabelSmall}>ANO</Text>
      <Text style={destaqueStyles.infoLabel}>{principal.ano || 'N/A'}</Text>

      <Text style={destaqueStyles.infoLabelSmall}>KM</Text>
      <Text style={destaqueStyles.infoValue}>{km}</Text>

      <Text style={destaqueStyles.infoLabelSmall}>R$</Text>
      <Text style={destaqueStyles.infoPrice}>{price}</Text>
    </View>
  );
  return (
    <View style={destaqueStyles.container}>
      <Text style={destaqueStyles.title}>{principal.title}</Text>
      <Text style={destaqueStyles.subtitle}>{principal.description}</Text>

      <View style={destaqueStyles.mainContent}>
        <Image
          source={principal.image}
          style={destaqueStyles.image}
          resizeMode="cover"
        />

        <View style={destaqueStyles.info}>
          {/* Passando principal.price */}
          {formatPriceAndKM(principal.km, principal.price)}

          <TouchableOpacity
            style={destaqueStyles.infoButton}
            // 3. ATUALIZAMOS O ONPRESS PARA NAVEGAR PARA 'Detalhes'
            onPress={() => navigation.navigate('Detalhes', { car: principal })}>
            <Text style={destaqueStyles.infoButtonText}>MAIS INFORMAÇÕES</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

// ===================== NOVO COMPONENTE: CARD REUTILIZÁVEL (CLICÁVEL) =====================
const VeiculoCard = ({ item, isHorizontal }) => {
  // Hook de navegação
  const navigation = useNavigation();
  // Define os estilos com base na orientação (Home: Horizontal; Estoque: Vertical)
  const cardStyle = isHorizontal ?
    carCardStyles.card : estoqueStyles.card;
  const imageStyle = isHorizontal ? carCardStyles.image : estoqueStyles.image;
  // Função de navegação
  const handlePress = () => {
    // Navega APENAS se o carro NÃO estiver coberto
    if (!item.coberto) {
      // Navega para a tela 'Detalhes', passando o objeto do carro
      navigation.navigate('Detalhes', { car: item });
    }
  };

  // ------------------ LAYOUT HORIZONTAL (CARROS DOS SONHOS) ------------------
  if (isHorizontal) {
    return (
      <TouchableOpacity
        style={cardStyle}
        onPress={handlePress}
        // Desabilita o clique se estiver em "Aguarde..."
        disabled={item.coberto}>
        {item.coberto ? (
          <View style={carCardStyles.cover}>
            <Text style={carCardStyles.coverTextBig}>AUTO</Text>
            <Text style={carCardStyles.coverTextSmall}>SMART</Text>
            <Text style={carCardStyles.coverWait}>Aguarde...</Text>
          </View>
        ) : (
          <Image source={item.image} style={imageStyle} resizeMode="cover" />
        )}

        <View style={carCardStyles.info}>
          <Text style={carCardStyles.title}>{item.title}</Text>
          {item.subtitle && (
            <>
              <Text style={carCardStyles.subtitle}>
                {item.subtitle.split(' ').slice(0, 3).join(' ')}
              </Text>
              <Text style={carCardStyles.subtitle}>
                {item.subtitle.split(' ').slice(3).join(' ')}
              </Text>
            </>
          )}
        </View>
      </TouchableOpacity>
    );
  }

  // ------------------ LAYOUT VERTICAL (ESTOQUE) ------------------
  return (
    <TouchableOpacity
      style={cardStyle}
      onPress={handlePress}
      // Desabilita o clique se estiver em "Aguarde..."
      disabled={item.coberto}>
      <Image source={item.image} style={imageStyle} resizeMode="cover" />

      {item.coberto && (
        <View style={estoqueStyles.coverOverlay}>
          <Text style={estoqueStyles.coverText}>AGUARDE...</Text>
        </View>
      )}

      <Text style={estoqueStyles.title}>{item.title}</Text>
      
      {/* CÓDIGO CORRIGIDO AQUI: Apenas o texto de localização é mantido */}
      <View
        style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
        <Text style={estoqueStyles.locationText}>
          {item.description || item.subtitle || 'Detalhes'}
        </Text>
      </View>
      <Text style={estoqueStyles.priceText}>
        {item.price || 'Preço sob consulta'}
      </Text>
    </TouchableOpacity>
  );
};


// ===================== TELA INÍCIO (HOME) =====================
function HomeScreen() {
  return (
    // ENVOLVIDO EM SAFEARVIVEW
    <SafeAreaView style={styles.safeArea}>
      <HeaderChico />
      <ScrollView style={styles.scrollView}>
        <View style={styles.divider} />
        <DestacadoSection />
        <View style={styles.dividerLarge} />

        <View style={sonhosStyles.container}>
          <Text style={sonhosStyles.title}>
            Quer encontrar o carro{' '}
            <Text style={{ fontWeight: 'bold' }}>dos seus sonhos?</Text>
          </Text>
          <Text style={sonhosStyles.subtitle}>
            Acesse nossos dedicados e selecionadas opções!
          </Text>

          <FlatList
            data={carrosSonhos}
            // USANDO o NOVO VeiculoCard para itens clicáveis
            renderItem={({ item }) => (
              <VeiculoCard item={item} isHorizontal={true} />
            )}
            keyExtractor={(item) => item.id.toString()}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16 }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ===================== TELA ESTOQUE =====================
function EstoqueScreen() {
  // USANDO o NOVO VeiculoCard para itens clicáveis
  const renderCar = ({ item }) => (
    <VeiculoCard item={item} isHorizontal={false} />
  );
  return (
    // ENVOLVIDO EM SAFEARVIVEW
    <SafeAreaView style={styles.safeArea}>
      <HeaderChico />
      <ScrollView style={styles.scrollView}>
        <View style={styles.divider} />
        <FlatList
          data={todoEstoque}
          renderItem={renderCar} 
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          scrollEnabled={false}
          contentContainerStyle={{ paddingHorizontal: 8 }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

// ===================== TELA EMPRESA (COM WHATSAPP) =====================
function CompanyScreen() {
  // Definimos o número para o botão "FALE CONOSCO AGORA"
  const contactNumber = '5545998218382';
  const handleWhatsAppPress = () => {
    // Mensagem genérica para contato com a empresa
    const message =
      'Olá! Gostaria de falar com a equipe AutoSmart sobre informações gerais e serviços.';
    // Codifica a mensagem
    const encodedMessage = encodeURIComponent(message);
    // Constrói o URL usando o formato HTTPS wa.me
    const whatsappUrl = `https://wa.me/${contactNumber}?text=${encodedMessage}`;
    // Abre o link
    Linking.openURL(whatsappUrl).catch((err) => {
      console.error('Falha ao abrir o link do WhatsApp:', err);
      // Mensagem de erro apropriada para o WhatsApp
      alert(
        'Não foi possível abrir o WhatsApp. Por favor, verifique se você tem um navegador ou o app instalado.'
      );
    });
  };

  return (
    // ENVOLVIDO EM SAFEARVIVEW
    <SafeAreaView style={styles.safeArea}>
      <HeaderChico />
      <ScrollView style={styles.scrollView}>
        <View style={styles.divider} />

        <View style={companyStyles.container}>
          <Text style={companyStyles.title}>A Sua Jornada Começa Aqui.</Text>
          <Text style={companyStyles.subtitle}>
            Conheça mais sobre a AutoSmart.
          </Text>

          <View style={companyStyles.missionContainer}>
            <Text style={companyStyles.missionTitle}>Missão & Visão</Text>
            <Text style={companyStyles.missionText}>
              Tornar a aquisição de veículos premium um processo transparente,
              confiável e empolgante. Visualizamos um futuro onde cada cliente
              encontra o carro perfeito que se encaixa em seu estilo de vida e
              ambições.
            </Text>
          </View>

          <View style={companyStyles.textBlock}>
            <Text style={companyStyles.blockTextBold}>
              A AutoSmart não é apenas uma revenda de veículos.
            </Text>
            <Text style={companyStyles.blockText}>
              Somos consultores apaixonados por carros, dedicados a selecionar
              apenas os melhores modelos do mercado. Nossa curadoria rigorosa
              garante que cada veículo em nosso estoque — desde o esportivo
              compacto até a picape robusta — atenda aos mais altos padrões de
              qualidade e procedência. {'\n\n'}
              Com anos de experiência e um foco inabalável na satisfação do
              cliente, oferecemos uma experiência de compra totalmente digital e
              personalizada, eliminando as burocracias e focando no que
              realmente importa: você e seu novo carro.
            </Text>
          </View>

          <TouchableOpacity
            style={companyStyles.contactButton}
            onPress={handleWhatsAppPress} // ATUALIZADO PARA WHATSAPP
          >
            {/* Ícone atualizado para WhatsApp */}
            <Ionicons name="logo-whatsapp" size={20} color="#fff" />
            <Text style={companyStyles.contactButtonText}>
              FALE CONOSCO AGORA
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}


// ===================== NAVEGAÇÃO PRINCIPAL (Wrapper do Tab Navigator) =====================
export function Home() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Estoque') {
            iconName = focused ? 'car-sport' : 'car-sport-outline';
          }
          else if (route.name === 'Financiamento') {
            iconName = focused ? 'cash' : 'cash-outline';
          }
          else if (route.name === 'Empresa') {
            iconName = focused ? 'business' : 'business-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#000',
        tabBarInactiveTintColor: 'gray',
      })}>
      {/* As telas */}
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Estoque" component={EstoqueScreen} />
      <Tab.Screen name="Financiamento" component={FinancingScreen} />
      <Tab.Screen name="Empresa" component={CompanyScreen} />
    </Tab.Navigator>
  );
}

// ===================== ESTILOS GERAIS =====================
const styles = StyleSheet.create({
  // Novo estilo de SafeAreaView
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
    // Removendo backgroundColor para evitar que a Safe Area fique branca no topo
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginHorizontal: 16,
  },
  dividerLarge: {
    height: 30,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1D2A32',
    marginVertical: 18,
  },
});
// ===================== ESTILOS: HEADERCHICO (Centralizado) =====================
const headerStyles = StyleSheet.create({
  containerCentralized: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    // Mantido paddingVertical, mas o SafeAreaView controla a área superior
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  logoContainerCentralized: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoTextNormal: {
    fontSize: 18,
    fontWeight: '300',
    color: '#333',
  },
  logoTextBold: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});
// ===================== ESTILOS: DESTAQUE PRINCIPAL =====================
const destaqueStyles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1D2A32',
    marginTop: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
    marginBottom: 20,
  },
  mainContent: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  image: {
    // >> ALTERAÇÃO APLICADA: Largura fixa de 250px para bloquear o esticamento
    width: 250, 
    height: 200,
    backgroundColor: '#eee',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  info: {
    // Agora usa flex: 1 para ocupar o espaço restante
    flex: 1,
    paddingLeft: 10,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  infoLabel: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    fontWeight: 'bold',
  },
  infoLabelSmall: {
    fontSize: 12,
    color: '#888',
    marginBottom: 2,
    marginTop: 5,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  infoPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  infoButton: {
    backgroundColor: '#fff',
    borderColor: '#333',
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    width: '100%',
    alignItems: 'center',
  },
  infoButtonText: {
    color: '#333',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

// ===================== ESTILOS: CARRO DOS SONHOS =====================
const sonhosStyles = StyleSheet.create({
  container: {
    paddingTop: 16,
    paddingBottom: 30,
    position: 'relative',
  },
  title: {
    fontSize: 18,
    color: '#1D2A32',
    paddingHorizontal: 16,
  },
  subtitle: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
    marginBottom: 10,
    paddingHorizontal: 16,
  },
  estoqueButton: {
    position: 'absolute',
    top: 0,
    right: 16,
    backgroundColor: '#333',
    paddingVertical: 10,
    paddingHorizontal: 20,
    zIndex: 10,
  },
  estoqueButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
const carCardStyles = StyleSheet.create({
  card: {
    width: width / 3 - 25,
    marginRight: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 0,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 80,
    marginBottom: 5,
  },
  cover: {
    width: '100%',
    height: 80,
    backgroundColor: '#404040',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  coverTextBig: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    zIndex: 5,
  },
  coverTextSmall: {
    color: '#fff',
    fontSize: 10,
    zIndex: 5,
  },
  coverWait: {
    color: '#fff',
    fontSize: 10,
    zIndex: 5,
    marginTop: 5,
  },
  info: {
    padding: 8,
    alignItems: 'center',
  },
  title: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
    lineHeight: 12,
  },
});
// ===================== ESTILOS: ESTOQUE (IMAGEM AUMENTADA) =====================
const estoqueStyles = StyleSheet.create({
  card: {
    width: width / 2 - 24,
    backgroundColor: '#fff',
    margin: 8,
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#eee',
    elevation: 1,
    position: 'relative', // Adicionado para a overlay funcionar
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 5,
    marginBottom: 10,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
    color: '#1D2A32',
  },
  locationText: {
    // marginLeft removido para que o texto comece logo
    fontSize: 12,
    color: '#666',
    // Adicionado um pequeno padding horizontal para alinhar melhor o texto
    paddingHorizontal: 5, 
  },
  priceText: {
    marginTop: 8,
    fontWeight: 'bold',
    color: '#075EEC',
    fontSize: 16,
  },
  // Novo estilo para a overlay de "Aguarde"
  coverOverlay: {
    position: 'absolute',
    top: 10,
    left: 10,
    width: '100%',
    height: 150, // Mesma altura da imagem
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Fundo escuro semi-transparente
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1, // Garante que fique por cima da imagem
  },
  coverText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
// ===================== ESTILOS: EMPRESA =====================
const companyStyles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1D2A32',
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    marginBottom: 20,
  },
  missionContainer: {
    backgroundColor: '#F5F5F5',
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#000',
  },
  missionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1D2A32',
    marginBottom: 8,
  },
  missionText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  textBlock: {
    marginBottom: 30,
  },
  blockTextBold: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1D2A32',
    marginBottom: 10,
  },
  blockText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 22,
  },
  contactButton: {
    flexDirection: 'row',
    backgroundColor: '#075EEC',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  contactButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});