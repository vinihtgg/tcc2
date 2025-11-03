import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Image,
    Text,
    View,
    TouchableOpacity,
    Dimensions,
    Linking
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';

// Obtemos a largura da tela para estilos responsivos
const { width } = Dimensions.get('window');

// ===================== COMPONENTE: HEADER (COM LOGO CENTRALIZADO E VOLTAR) =====================
const HeaderChico = ({ showBackButton = false, navigation }) => (
    // O container principal usa space-between para separar a seta, o logo e o espaçador
    <View style={headerStyles.containerCentralized}>
        {showBackButton && (
            // Botão Voltar (fica à esquerda)
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingRight: 15 }}>
                <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
        )}

        {/* CORREÇÃO: logoWrapper usa flex: 1 e alinha o logo no centro do espaço restante */}
        <View style={headerStyles.logoWrapper}>
            <View style={headerStyles.logoContainerCentralized}>
                <Text style={headerStyles.logoTextNormal}>AUTO</Text>
                <Text style={headerStyles.logoTextBold}>SMART</Text>
            </View>
        </View>

        {/* ESPAÇADOR: View invisível para compensar o espaço da seta e centralizar o logo */}
        {showBackButton && (
            // Largura aproximada da seta (24px) + padding (15px) = 39px
            <View style={{ width: 39 }} /> 
        )}
    </View>
);

// ===================== TELA: DETALHES DO CARRO (FINAL) =====================
export function CarDetailsScreen() {
    const navigation = useNavigation();
    const route = useRoute();

    // Objeto do carro
    const car = route.params?.car;

    const phoneNumber = '5545998218382'; // Seu número de contato

    if (!car) {
        return (
            <View style={detailsStyles.fallbackContainer}>
                <Text style={detailsStyles.fallbackText}>Carro não encontrado.</Text>
                <TouchableOpacity onPress={() => navigation.goBack()} style={detailsStyles.fallbackButton}>
                    <Text style={detailsStyles.fallbackButtonText}>Voltar</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // --- FUNÇÃO DE CONTATO DO WHATSAPP ---
    const handleContactPress = () => {
        const carTitle = car.title || 'Veículo em Destaque';
        const message = `Olá! Tenho interesse no veículo *${carTitle}* (Ano ${car.ano || 'N/A'}). Poderia me dar mais informações?`;

        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

        Linking.openURL(whatsappUrl).catch((err) => {
            console.error('Falha ao abrir o link do WhatsApp:', err);
            alert('Não foi possível abrir o WhatsApp. Por favor, verifique se você tem um navegador ou o app instalado.');
        });
    };

    // --- FUNÇÃO DE NAVEGAÇÃO PARA FINANCIAMENTO ---
    const handleFinancingPress = () => {
        // Assume-se que 'Financiamento' é uma rota acessível via Stack Navigator
        navigation.navigate('Financiamento', { car: car });
    };

    return (
        <ScrollView style={styles.scrollView}>
            {/* Chamada do Header com o botão de voltar e o logo centralizado */}
            <HeaderChico showBackButton={true} navigation={navigation} />
            <View style={styles.divider} />

            <View style={detailsStyles.container}>
                <Image
                    source={car.image}
                    style={detailsStyles.image}
                    resizeMode="cover"
                />

                <Text style={detailsStyles.price}>{car.price}</Text>

                <Text style={detailsStyles.title}>{car.title}</Text>

                <View style={detailsStyles.infoRow}>
                    <View style={detailsStyles.infoBox}>
                        <Text style={detailsStyles.infoLabel}>ANO</Text>
                        <Text style={detailsStyles.infoValue}>{car.ano || 'N/A'}</Text>
                    </View>
                    <View style={detailsStyles.infoBox}>
                        <Text style={detailsStyles.infoLabel}>QUILOMETRAGEM</Text>
                        <Text style={detailsStyles.infoValue}>{car.km || 'N/A'}</Text>
                    </View>
                </View>

                <View style={detailsStyles.descriptionBox}>
                    <Text style={detailsStyles.descriptionTitle}>Descrição Detalhada e Procedência</Text>

                    {/* >>>>>>> DESCRIÇÃO GENÉRICA <<<<<<< */}
                    <Text style={detailsStyles.descriptionText}>
                        Este veículo passou por um rigoroso processo de **curadoria e inspeção**, garantindo a mais alta qualidade e procedência.

                        Na **AutoSmart**, você tem a certeza de estar adquirindo um carro com:
                        {'\n\n'}
                        • **Histórico 100% verificado:** Sem histórico de leilão ou sinistro.
                        {'\n'}
                        • **Mecânica Revisada:** Pronto para rodar com segurança e tranquilidade.
                        {'\n'}
                        • **Garantia de Satisfação:** Foco total na sua experiência de compra.
                        {'\n\n'}
                        Agende seu test drive ou fale com um consultor agora mesmo para garantir esta oportunidade!
                    </Text>
                </View>

                {/* BOTÃO DE FINANCIAMENTO */}
                <TouchableOpacity
                    style={[detailsStyles.financingButton, { marginBottom: 15 }]}
                    onPress={handleFinancingPress}
                >
                    <Ionicons name="calculator-outline" size={20} color="#fff" />
                    <Text style={detailsStyles.contactButtonText}>SIMULAR FINANCIAMENTO</Text>
                </TouchableOpacity>


                {/* BOTÃO DO WHATSAPP */}
                <TouchableOpacity
                    style={detailsStyles.contactButton}
                    onPress={handleContactPress}
                >
                    <Ionicons name="logo-whatsapp" size={20} color="#fff" />
                    <Text style={detailsStyles.contactButtonText}>FALAR COM VENDEDOR</Text>
                </TouchableOpacity>

            </View>
        </ScrollView>
    );
}

// ===================== ESTILOS =====================

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        backgroundColor: '#fff',
    },
    divider: {
        height: 1,
        backgroundColor: '#eee',
        marginHorizontal: 16,
    },
});

const headerStyles = StyleSheet.create({
    // CORRIGIDO: Usa space-between para separar os 3 elementos (seta, logoWrapper, espaçador)
    containerCentralized: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: '#fff',
    },
    // NOVO ESTILO: Container que preenche o espaço central e centraliza o logo
    logoWrapper: {
        flex: 1, 
        alignItems: 'center', 
    },
    logoContainerCentralized: { 
        flexDirection: 'row',
        alignItems: 'center',
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


const detailsStyles = StyleSheet.create({
    container: {
        padding: 16,
    },
    image: {
        width: '100%',
        height: 250,
        borderRadius: 8,
        marginBottom: 20,
    },
    price: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#075EEC', // Preço destacado em azul
        marginBottom: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1D2A32',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#555',
        marginBottom: 20,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
        backgroundColor: '#f9f9f9',
        padding: 15,
        borderRadius: 8,
    },
    infoBox: {
        alignItems: 'center',
        width: '45%',
    },
    infoLabel: {
        fontSize: 14,
        color: '#888',
        fontWeight: 'bold',
    },
    infoValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 4,
    },
    descriptionBox: {
        marginBottom: 20,
        paddingBottom: 10,
    },
    descriptionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1D2A32',
        marginBottom: 10,
    },
    // Estilo para a descrição que funciona para todos os carros
    descriptionText: {
        fontSize: 14,
        color: '#555',
        lineHeight: 22,
        paddingTop: 5,
    },
    // Estilo para o botão de contato (WhatsApp)
    contactButton: {
        flexDirection: 'row',
        backgroundColor: '#25D366', // Cor do WhatsApp
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 3,
        marginTop: 10,
    },
    // Estilo para o botão de financiamento (Novo)
    financingButton: {
        flexDirection: 'row',
        backgroundColor: '#075EEC', // Cor principal da loja
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 3,
        marginTop: 20,
    },
    contactButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    fallbackContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    fallbackText: {
        fontSize: 18,
        marginBottom: 20,
        color: '#555',
    },
    fallbackButton: {
        backgroundColor: '#000',
        padding: 10,
        borderRadius: 5,
    },
    fallbackButtonText: {
        color: '#fff',
    }
});