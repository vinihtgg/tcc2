import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

// NOTE: Se HeaderChico, styles e o componente Home (que contém o Tab Navigator)
// estão em arquivos diferentes, você precisará importar HeaderChico e styles daqui.
// Para fins deste bloco de código, vamos assumir que HeaderChico e styles (com
// suas propriedades como styles.scrollView e styles.divider) estão disponíveis,
// ou que esta é a parte do código onde você as está redefinindo/utilizando.

// Se HeaderChico for um componente em outro arquivo, importe-o assim:
// import { HeaderChico } from 'caminho/para/HeaderChico'; 

// ===================== TELA EMPRESA =====================
function CompanyScreen() {
  // NOTA: Para este componente funcionar isoladamente, 
  // 'styles.scrollView' e 'styles.divider' precisam estar definidos ou importados.
  // Estou utilizando a definição local para 'companyStyles'.
  return (
    <ScrollView style={styles.scrollView}>
      {/* Utiliza o mesmo Header para manter a consistência da 'web' */}
      {/* <HeaderChico />  <-- Descomente e importe se for um componente externo */}
      <View style={styles.divider} />

      <View style={companyStyles.container}>
        <Text style={companyStyles.title}>
            A Sua Jornada Começa Aqui.
        </Text>
        <Text style={companyStyles.subtitle}>
            Conheça mais sobre a AutoSmart.
        </Text>

        <View style={companyStyles.missionContainer}>
            <Text style={companyStyles.missionTitle}>Missão & Visão</Text>
            <Text style={companyStyles.missionText}>
                Tornar a aquisição de veículos premium um processo transparente, 
                confiável e empolgante. Visualizamos um futuro onde cada cliente 
                encontra o carro perfeito que se encaixa em seu estilo de vida 
                e ambições.
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
                compacto até a picape robusta — atenda aos mais altos padrões 
                de qualidade e procedência.
                {'\n\n'}
                Com anos de experiência e um foco inabalável na satisfação do 
                cliente, oferecemos uma experiência de compra totalmente digital 
                e personalizada, eliminando as burocracias e focando no que 
                realmente importa: você e seu novo carro.
            </Text>
        </View>

        {/* Botão de Contato com ícone */}
        <TouchableOpacity style={companyStyles.contactButton}>
            <Ionicons name="call-outline" size={20} color="#fff" />
            <Text style={companyStyles.contactButtonText}>FALE CONOSCO AGORA</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}


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
        backgroundColor: '#F5F5F5', // Um cinza claro para destacar o bloco
        padding: 15,
        borderRadius: 5,
        marginBottom: 20,
        borderLeftWidth: 4,
        borderLeftColor: '#000', // Linha preta para dar um toque de design
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
        backgroundColor: '#075EEC', // Cor de destaque para o botão de ação
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

// A função 'styles' e 'HeaderChico' são necessárias, mas não foram definidas aqui.
// Para que o código compile, vou incluir definições MOCK mínimas:

const styles = StyleSheet.create({
    scrollView: { flex: 1, backgroundColor: '#fff' },
    divider: { height: 1, backgroundColor: '#eee', marginHorizontal: 16 },
});

// Mock do HeaderChico, pois ele é usado na tela:
const HeaderChico = () => (
    <View style={{ height: 40, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: '#eee' }}>
        <Text style={{ fontWeight: 'bold' }}>AUTO SMART</Text>
    </View>
);

// Exporte a tela para ser usada no Tab Navigator do arquivo 'Home'
export { CompanyScreen };