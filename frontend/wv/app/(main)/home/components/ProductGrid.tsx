import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useTheme } from '@/src/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { productService } from '@/src/api';

export const ProductGrid = () => {
    const { colors } = useTheme();
    const router = useRouter();
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await productService.getProducts({ limit: 6 });
                if (response && response.products) {
                    setProducts(response.products);
                }
            } catch (error) {
                console.error('Failed to fetch products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const ProductCard = ({ item }: { item: any }) => (
        <TouchableOpacity
            style={[styles.card, { backgroundColor: colors.surface }]}
            activeOpacity={0.9}
            onPress={() => router.push(`/buy/${item._id}`)}
        >
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: item.thumbnail?.url || 'https://placehold.co/400x400/png?text=No+Image' }}
                    style={styles.image}
                    resizeMode="cover"
                />
                <TouchableOpacity style={styles.heartButton}>
                    <Ionicons name="heart-outline" size={20} color={colors.primary} />
                </TouchableOpacity>
            </View>
            <View style={styles.details}>
                <Text style={[styles.category, { color: colors.text + '80' }]}>
                    {item.category?.name || 'Product'}
                </Text>
                <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
                    {item.name}
                </Text>
                <View style={styles.row}>
                    <Text style={[styles.price, { color: colors.primary }]}>
                        Rs. {item.price}
                    </Text>
                    <View style={styles.rating}>
                        <Ionicons name="star" size={14} color="#FFD700" />
                        <Text style={[styles.ratingText, { color: colors.text + '80' }]}>
                            {item.stats?.rating || 4.0}
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={[styles.container, { alignItems: 'center', paddingVertical: 40 }]}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: colors.text }]}>Featured Products</Text>
            </View>
            <View style={styles.grid}>
                {products.map((product) => (
                    <ProductCard key={product._id} item={product} />
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        paddingHorizontal: 20,
    },
    header: {
        marginBottom: 15,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    card: {
        width: '48%', // Flexible width
        borderRadius: 12,
        marginBottom: 20,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        overflow: 'hidden',
    },
    imageContainer: {
        height: 150,
        width: '100%',
        backgroundColor: '#f0f0f0',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    heartButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: '#fff',
        borderRadius: 15,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
    },
    details: {
        padding: 10,
    },
    category: {
        fontSize: 12,
        marginBottom: 2,
    },
    name: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 6,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    price: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    rating: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingText: {
        fontSize: 12,
        marginLeft: 4,
    }
});
