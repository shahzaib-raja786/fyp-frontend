import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
    Alert,
    Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/context/ThemeContext';
import cartService from '@/src/api/cartService';
import orderService from '@/src/api/orderService';

export default function CheckoutScreen() {
    const router = useRouter();
    const { colors } = useTheme();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [cart, setCart] = useState<any>(null);

    // Shipping form state
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [postalCode, setPostalCode] = useState('');

    // Payment method
    const [paymentMethod, setPaymentMethod] = useState('cod');

    useEffect(() => {
        loadCart();
    }, []);

    const loadCart = async () => {
        try {
            setLoading(true);
            const response = await cartService.getCart();
            setCart(response.cart);

            if (!response.cart?.items || response.cart.items.length === 0) {
                if (Platform.OS === 'web') {
                    alert('Your cart is empty');
                } else {
                    Alert.alert('Empty Cart', 'Your cart is empty');
                }
                router.push('/cart');
            }
        } catch (error: any) {
            console.error('Load cart error:', error);
            if (error.response?.status === 401) {
                router.push('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    const validateForm = () => {
        if (!fullName.trim()) {
            if (Platform.OS === 'web') {
                alert('Please enter your full name');
            } else {
                Alert.alert('Required', 'Please enter your full name');
            }
            return false;
        }
        if (!phone.trim()) {
            if (Platform.OS === 'web') {
                alert('Please enter your phone number');
            } else {
                Alert.alert('Required', 'Please enter your phone number');
            }
            return false;
        }
        if (!address.trim()) {
            if (Platform.OS === 'web') {
                alert('Please enter your address');
            } else {
                Alert.alert('Required', 'Please enter your address');
            }
            return false;
        }
        if (!city.trim()) {
            if (Platform.OS === 'web') {
                alert('Please enter your city');
            } else {
                Alert.alert('Required', 'Please enter your city');
            }
            return false;
        }
        return true;
    };

    const handlePlaceOrder = async () => {
        if (!validateForm()) return;

        try {
            setSubmitting(true);

            const orderData = {
                shippingAddress: {
                    fullName,
                    phone,
                    address,
                    city,
                    postalCode
                },
                paymentMethod,
                subtotal: cart.totalPrice,
                shippingFee: 0,
                total: cart.totalPrice
            };

            await orderService.createOrder(orderData);
            await cartService.clearCart();

            if (Platform.OS === 'web') {
                alert('Order placed successfully!');
            } else {
                Alert.alert('Success', 'Order placed successfully!');
            }

            router.push('/orders');
        } catch (error: any) {
            console.error('Place order error:', error);
            const errorMsg = error.response?.data?.message || 'Failed to place order';
            if (Platform.OS === 'web') {
                alert(errorMsg);
            } else {
                Alert.alert('Error', errorMsg);
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            </SafeAreaView>
        );
    }

    const shippingFee = 0;
    const total = (cart?.totalPrice || 0) + shippingFee;

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Checkout</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView style={styles.scrollView}>
                {/* Shipping Address Section */}
                <View style={[styles.section, { backgroundColor: colors.surface }]}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Shipping Address</Text>

                    <TextInput
                        style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                        placeholder="Full Name"
                        placeholderTextColor={colors.text + '60'}
                        value={fullName}
                        onChangeText={setFullName}
                    />

                    <TextInput
                        style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                        placeholder="Phone Number"
                        placeholderTextColor={colors.text + '60'}
                        value={phone}
                        onChangeText={setPhone}
                        keyboardType="phone-pad"
                    />

                    <TextInput
                        style={[styles.input, styles.textArea, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                        placeholder="Address (Street, Area)"
                        placeholderTextColor={colors.text + '60'}
                        value={address}
                        onChangeText={setAddress}
                        multiline
                        numberOfLines={3}
                    />

                    <View style={styles.row}>
                        <TextInput
                            style={[styles.input, styles.halfInput, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                            placeholder="City"
                            placeholderTextColor={colors.text + '60'}
                            value={city}
                            onChangeText={setCity}
                        />

                        <TextInput
                            style={[styles.input, styles.halfInput, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
                            placeholder="Postal Code"
                            placeholderTextColor={colors.text + '60'}
                            value={postalCode}
                            onChangeText={setPostalCode}
                            keyboardType="number-pad"
                        />
                    </View>
                </View>

                {/* Payment Method Section */}
                <View style={[styles.section, { backgroundColor: colors.surface }]}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Payment Method</Text>

                    <TouchableOpacity
                        style={[styles.paymentOption, { borderColor: paymentMethod === 'cod' ? colors.primary : colors.border }]}
                        onPress={() => setPaymentMethod('cod')}
                    >
                        <Ionicons
                            name={paymentMethod === 'cod' ? 'radio-button-on' : 'radio-button-off'}
                            size={24}
                            color={paymentMethod === 'cod' ? colors.primary : colors.text + '60'}
                        />
                        <View style={styles.paymentInfo}>
                            <Text style={[styles.paymentTitle, { color: colors.text }]}>Cash on Delivery</Text>
                            <Text style={[styles.paymentSubtitle, { color: colors.text + '80' }]}>Pay when you receive</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Order Summary Section */}
                <View style={[styles.section, { backgroundColor: colors.surface }]}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Order Summary</Text>

                    {cart?.items?.map((item: any) => (
                        <View key={item._id} style={styles.orderItem}>
                            <Text style={[styles.itemName, { color: colors.text }]} numberOfLines={1}>
                                {item.productId.name} x {item.quantity}
                            </Text>
                            <Text style={[styles.itemPrice, { color: colors.text }]}>
                                Rs. {item.price * item.quantity}
                            </Text>
                        </View>
                    ))}

                    <View style={[styles.divider, { backgroundColor: colors.border }]} />

                    <View style={styles.summaryRow}>
                        <Text style={[styles.summaryLabel, { color: colors.text + '80' }]}>Subtotal</Text>
                        <Text style={[styles.summaryValue, { color: colors.text }]}>Rs. {cart?.totalPrice || 0}</Text>
                    </View>

                    <View style={styles.summaryRow}>
                        <Text style={[styles.summaryLabel, { color: colors.text + '80' }]}>Shipping Fee</Text>
                        <Text style={[styles.summaryValue, { color: colors.text }]}>Rs. {shippingFee}</Text>
                    </View>

                    <View style={[styles.divider, { backgroundColor: colors.border }]} />

                    <View style={styles.summaryRow}>
                        <Text style={[styles.totalLabel, { color: colors.text }]}>Total</Text>
                        <Text style={[styles.totalValue, { color: colors.primary }]}>Rs. {total}</Text>
                    </View>
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Bottom Action Bar */}
            <View style={[styles.bottomBar, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
                <View style={styles.totalContainer}>
                    <Text style={[styles.bottomTotalLabel, { color: colors.text + '80' }]}>Total</Text>
                    <Text style={[styles.bottomTotalValue, { color: colors.primary }]}>Rs. {total}</Text>
                </View>
                <TouchableOpacity
                    style={[styles.placeOrderButton, { backgroundColor: colors.primary }]}
                    onPress={handlePlaceOrder}
                    disabled={submitting}
                >
                    {submitting ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <>
                            <Text style={styles.placeOrderText}>Place Order</Text>
                            <Ionicons name="arrow-forward" size={20} color="#fff" />
                        </>
                    )}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    scrollView: {
        flex: 1,
    },
    section: {
        margin: 16,
        padding: 16,
        borderRadius: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 16,
        marginBottom: 12,
        fontSize: 16,
    },
    textArea: {
        height: 80,
        paddingTop: 12,
        textAlignVertical: 'top',
    },
    row: {
        flexDirection: 'row',
        gap: 12,
    },
    halfInput: {
        flex: 1,
    },
    paymentOption: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderWidth: 2,
        borderRadius: 12,
        marginBottom: 12,
    },
    paymentInfo: {
        marginLeft: 12,
        flex: 1,
    },
    paymentTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    paymentSubtitle: {
        fontSize: 14,
    },
    orderItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    itemName: {
        fontSize: 14,
        flex: 1,
        marginRight: 12,
    },
    itemPrice: {
        fontSize: 14,
        fontWeight: '600',
    },
    divider: {
        height: 1,
        marginVertical: 12,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    summaryLabel: {
        fontSize: 14,
    },
    summaryValue: {
        fontSize: 14,
        fontWeight: '600',
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    totalValue: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    bottomBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderTopWidth: 1,
    },
    totalContainer: {
        flex: 1,
    },
    bottomTotalLabel: {
        fontSize: 14,
        marginBottom: 4,
    },
    bottomTotalValue: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    placeOrderButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 12,
        gap: 8,
        minWidth: 150,
    },
    placeOrderText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
