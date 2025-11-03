import React, { useState, useMemo, useEffect } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    Keyboard,
    Alert,
    Dimensions
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';

// ===================== FUNÇÕES AUXILIARES =====================

// Função auxiliar para formatar números como moeda BRL (R$)
const formatCurrency = (value) => {
    if (isNaN(value)) return 'R$ 0,00';
    return parseFloat(value).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });
};

// Função auxiliar para remover formatação de preço
const cleanPrice = (priceString) => {
    if (!priceString) return 0;
    // Remove "R$", pontos de milhar, e substitui vírgula decimal por ponto
    const cleaned = priceString.replace('R$', '').replace(/\./g, '').replace(',', '.').trim();
    return parseFloat(cleaned) || 0;
};

// ===================== COMPONENTE: HEADER CORRIGIDO =====================
const HeaderChico = ({ showBackButton = false, navigation }) => (
    // Usa 'space-between' para separar os 3 elementos (Seta, Logo, Espaçador)
    <View style={headerStyles.containerCentralized}>
        {showBackButton && (
            // 1. Botão Voltar (Elemento da Esquerda)
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingRight: 15 }}>
                <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
        )}
        
        {/* 2. Logo (Elemento Central) - Usa logoWrapper para centralizar */}
        <View style={headerStyles.logoWrapper}>
            <View style={headerStyles.logoContainerCentralized}>
                <Text style={headerStyles.logoTextNormal}>AUTO</Text>
                <Text style={headerStyles.logoTextBold}>SMART</Text>
            </View>
        </View>

        {/* 3. ESPAÇADOR (Elemento da Direita) - Força a centralização do logo */}
        {showBackButton && (
            // A largura (39) compensa a largura da seta (24) + padding (15)
            <View style={{ width: 39 }} /> 
        )}

        {!showBackButton && (
            // Se não houver seta, o logo usa o justify-content: 'center' normal
            <View style={headerStyles.logoContainerCentralized}>
                <Text style={headerStyles.logoTextNormal}>AUTO</Text>
                <Text style={headerStyles.logoTextBold}>SMART</Text>
            </View>
        )}
    </View>
);

const headerStyles = StyleSheet.create({
    containerCentralized: {
        flexDirection: 'row',
        alignItems: 'center',
        // CORREÇÃO: Usamos space-between para distribuir Seta, Logo e Espaçador
        justifyContent: 'space-between', 
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: '#fff',
    },
    // NOVO ESTILO: Container que preenche o espaço central e centraliza o logo
    logoWrapper: {
        flex: 1, // Ocupa todo o espaço central
        alignItems: 'center', // Centraliza o logo dentro deste espaço
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

// ===================== COMPONENTE: CALCULADORA DE FINANCIAMENTO =====================

export function FinancingScreen() {
    
    const route = useRoute();
    const navigation = useNavigation(); 
    const initialCar = route.params?.car; 
    
    // --- LÓGICA DE ESTADOS ---
    
    const initialVehiclePrice = initialCar ? cleanPrice(initialCar.price) : 0;

    const [vehiclePrice, setVehiclePrice] = useState(initialVehiclePrice);
    const [priceInput, setPriceInput] = useState(formatCurrency(initialVehiclePrice));
    
    const [downPayment, setDownPayment] = useState(0);
    const [downPaymentInput, setDownPaymentInput] = useState(formatCurrency(0));

    const [interestRate, setInterestRate] = useState('1.5'); // Taxa mensal
    const [loanTerm, setLoanTerm] = useState('60'); // Prazo em meses
    const [result, setResult] = useState(null);

    // --- EFEITO PARA GARANTIR QUE O PREÇO INICIAL É CARREGADO DA ROTA ---
    useEffect(() => {
        if (initialCar && initialCar.price) {
            const price = cleanPrice(initialCar.price);
            setVehiclePrice(price);
            setPriceInput(formatCurrency(price));
            setResult(null); 
        }
    }, [initialCar]);
    
    // --- FUNÇÕES DE FORMATO ---

    const handlePriceChange = (text) => {
        const cleanValue = cleanPrice(text);
        setVehiclePrice(cleanValue);
        setPriceInput(text); 
        setResult(null);
    };

    const handleDownPaymentChange = (text) => {
        const cleanValue = cleanPrice(text);
        setDownPayment(cleanValue);
        setDownPaymentInput(text);
        setResult(null);
    };

    const handleBlur = (setterFunction, cleanValue) => {
        // Formata o input para BRL ao perder o foco
        setterFunction(formatCurrency(cleanValue));
    };

    // --- FUNÇÃO DE CÁLCULO (Fórmula PMT) ---

    const calculateFinancing = () => {
        Keyboard.dismiss();

        const price = vehiclePrice;
        const down = downPayment;
        // Divide por 100 para converter a taxa de % (Ex: 1.5) para decimal (Ex: 0.015)
        const rate = parseFloat(interestRate) / 100; 
        const term = parseInt(loanTerm);

        if (price <= 0) {
            Alert.alert("Erro", "O valor do veículo deve ser maior que R$ 0,00.");
            return;
        }
        if (down >= price) {
            Alert.alert("Erro", "A entrada deve ser menor que o valor total do veículo.");
            return;
        }
        if (rate <= 0 || term <= 0 || isNaN(rate) || isNaN(term)) {
            Alert.alert("Erro", "Verifique a taxa de juros e o prazo.");
            return;
        }

        const principal = price - down; // Valor a ser financiado

        // Taxa de juros mensal em decimal
        const monthlyRate = rate;
        // (1 + i)^n
        const powerTerm = Math.pow((1 + monthlyRate), term);
        
        // Parcela = P * [ i * (1 + i)^n ] / [ (1 + i)^n – 1 ]
        const monthlyPayment = principal * (monthlyRate * powerTerm) / (powerTerm - 1);

        if (isNaN(monthlyPayment) || monthlyPayment <= 0) {
            setResult("Não foi possível calcular. Verifique os valores.");
        } else {
            const total = monthlyPayment * term;
            const totalInterest = total - principal;
            
            setResult({
                monthlyPayment: monthlyPayment,
                total: total,
                principal: principal,
                totalInterest: totalInterest
            });
        }
    };

    // --- RENDERIZAÇÃO ---
    return (
        <SafeAreaView style={financingStyles.safeArea}>
            
            {/* O Header agora centraliza o logo com o botão de voltar */}
            <HeaderChico showBackButton={true} navigation={navigation} />
            <View style={financingStyles.divider} />
            
            <ScrollView 
                style={financingStyles.container} 
                keyboardShouldPersistTaps="handled"
            >
                <Text style={financingStyles.headerTitle}>
                    <Ionicons name="calculator-outline" size={24} color="#000" /> 
                    {' '}Simule Seu Financiamento
                </Text>
                <Text style={financingStyles.headerSubtitle}>
                    Preencha os dados abaixo para calcular sua parcela.
                </Text>

                <Text style={financingStyles.label}>Valor do Veículo</Text>
                <TextInput
                    style={financingStyles.input}
                    value={priceInput}
                    onChangeText={handlePriceChange}
                    onBlur={() => handleBlur(setPriceInput, vehiclePrice)}
                    keyboardType="numeric"
                    placeholder="R$ 0,00"
                />

                <Text style={financingStyles.label}>Valor da Entrada</Text>
                <TextInput
                    style={financingStyles.input}
                    value={downPaymentInput}
                    onChangeText={handleDownPaymentChange}
                    onBlur={() => handleBlur(setDownPaymentInput, downPayment)}
                    keyboardType="numeric"
                    placeholder="R$ 0,00"
                />

                <View style={financingStyles.row}>
                    <View style={financingStyles.halfInput}>
                        <Text style={financingStyles.label}>Taxa Mensal (%)</Text>
                        <TextInput
                            style={financingStyles.input}
                            value={interestRate}
                            onChangeText={setInterestRate}
                            keyboardType="numeric"
                            placeholder="Ex: 1.5"
                        />
                    </View>
                    <View style={financingStyles.halfInput}>
                        <Text style={financingStyles.label}>Prazo (Meses)</Text>
                        <TextInput
                            style={financingStyles.input}
                            value={loanTerm}
                            onChangeText={setLoanTerm}
                            keyboardType="numeric"
                            placeholder="Ex: 60"
                        />
                    </View>
                </View>

                <TouchableOpacity 
                    style={financingStyles.calculateButton}
                    onPress={calculateFinancing}
                >
                    <Text style={financingStyles.calculateButtonText}>CALCULAR PARCELA</Text>
                </TouchableOpacity>

                {result && (
                    <View style={financingStyles.resultBox}>
                        <Text style={financingStyles.resultTitle}>Resultado da Simulação</Text>
                        
                        {typeof result === 'string' ? (
                            <Text style={financingStyles.resultError}>{result}</Text>
                        ) : (
                            <>
                                <View style={financingStyles.resultRow}>
                                    <Text style={financingStyles.resultLabel}>Valor Financiado:</Text>
                                    <Text style={financingStyles.resultValue}>
                                        {formatCurrency(result.principal)}
                                    </Text>
                                </View>
                                <View style={financingStyles.resultRow}>
                                    <Text style={financingStyles.resultLabel}>Total de Juros:</Text>
                                    <Text style={financingStyles.resultValue}>
                                        {formatCurrency(result.totalInterest)}
                                    </Text>
                                </View>
                                <View style={financingStyles.resultRowTotal}>
                                    <Text style={financingStyles.resultLabelTotal}>Parcela Mensal Estimada:</Text>
                                    <Text style={financingStyles.resultValueTotal}>
                                        {formatCurrency(result.monthlyPayment)}
                                    </Text>
                                </View>
                                <Text style={financingStyles.disclaimer}>
                                    * Valores e taxas são apenas estimativas. O valor final será confirmado pela instituição financeira.
                                </Text>
                            </>
                        )}
                    </View>
                )}

            </ScrollView>
        </SafeAreaView>
    );
}

// ===================== ESTILOS DA CALCULADORA =====================

const financingStyles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    divider: {
        height: 1,
        backgroundColor: '#eee',
        marginHorizontal: 16,
    },
    container: {
        padding: 16,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1D2A32',
        marginTop: 10,
        marginBottom: 5,
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#888',
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginTop: 15,
        marginBottom: 5,
    },
    input: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        fontSize: 16,
        color: '#1D2A32',
        backgroundColor: '#f9f9f9',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    halfInput: {
        width: '48%',
    },
    calculateButton: {
        backgroundColor: '#075EEC',
        paddingVertical: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 20,
        elevation: 3,
    },
    calculateButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    resultBox: {
        backgroundColor: '#eef4ff',
        padding: 20,
        borderRadius: 8,
        borderLeftWidth: 4,
        borderLeftColor: '#075EEC',
        marginBottom: 50,
    },
    resultTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1D2A32',
        marginBottom: 15,
    },
    resultRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    resultRowTotal: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: '#dcdcdc',
        paddingTop: 10,
        marginTop: 10,
    },
    resultLabel: {
        fontSize: 14,
        color: '#555',
    },
    resultValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
    },
    resultLabelTotal: {
        fontSize: 16,
        fontWeight: '600',
        color: '#075EEC',
    },
    resultValueTotal: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#075EEC',
    },
    disclaimer: {
        fontSize: 12,
        color: '#888',
        marginTop: 15,
        fontStyle: 'italic',
    },
    resultError: {
        fontSize: 14,
        color: 'red',
        textAlign: 'center',
        fontWeight: 'bold',
    }
});