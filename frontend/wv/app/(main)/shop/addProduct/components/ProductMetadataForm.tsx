// src/components/shop/ProductMetadataForm.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Card, TextInput, Chip, Button, HelperText } from 'react-native-paper';
import {
  Tag,
  Palette,
  Ruler,
  Hash,
  DollarSign,
  Package,
  Type,
  FileText,
  Image as ImageIcon,
  Plus as PlusIcon,
  X as CloseIcon,
} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { productService } from '@/src/api/productService';
import { Image } from 'react-native';
import { useTheme } from '@/src/context/ThemeContext';
import { appTheme } from '@/src/theme/appTheme';
import {
  ClothingCategory,
  ClothingSize,
  ShoeSize,
  ColorOption,
} from '@/src/types';

// CATEGORIES removed - fetched from API
// CLOTHING_SIZES and SHOE_SIZES removed - fetched from API attributes
// COLOR_OPTIONS removed - fetched from API attributes

interface ProductMetadataFormProps {
  editProduct?: any;
  onSuccess?: () => void;
}

const ProductMetadataForm: React.FC<ProductMetadataFormProps> = ({ editProduct, onSuccess }) => {
  const { colors } = useTheme();
  const { spacing, radius, fonts } = appTheme.tokens;

  // Form State
  const [productName, setProductName] = useState('');
  const [brand, setBrand] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [sku, setSku] = useState('');
  const [description, setDescription] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');
  const [careInstructions, setCareInstructions] = useState('');
  const [tryon, setTryon] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);

  // Dynamic Categories State
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);
  const [specifications, setSpecifications] = useState<any>({});

  const [selectedColors, setSelectedColors] = useState<ColorOption[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<(ClothingSize | ShoeSize)[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  // Dynamic Type Selection
  const [selectedType, setSelectedType] = useState<string>('');

  const availableTypes = React.useMemo(() => {
    if (categories.length === 0) {
      console.log('⚠️ No categories loaded yet');
      return [];
    }
    const types = Array.from(new Set(categories.map(c => c.type)));
    console.log('🏷️ Available types:', types);
    return types;
  }, [categories]);

  // Set default type when categories load
  React.useEffect(() => {
    console.log(`🎯 Type selection - Current: "${selectedType}", Available:`, availableTypes);
    if (!selectedType && availableTypes.length > 0) {
      console.log(`✨ Setting default type to: ${availableTypes[0]}`);
      setSelectedType(availableTypes[0]);
    }
  }, [availableTypes, selectedType]);

  const [isLoading, setIsLoading] = useState(false);

  // Image State
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [productImages, setProductImages] = useState<string[]>([]);

  const pickThumbnail = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5, // Reduced to prevent file size issues
    });

    if (!result.canceled) {
      setThumbnail(result.assets[0].uri);
    }
  };

  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: 6 - productImages.length,
      quality: 0.5, // Reduced to prevent file size issues
    });

    if (!result.canceled) {
      const newUris = result.assets.map(asset => asset.uri);
      setProductImages([...productImages, ...newUris].slice(0, 6));
    }
  };

  const removeImage = (uri: string) => {
    setProductImages(productImages.filter(img => img !== uri));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleColorSelect = (color: ColorOption) => {
    if (selectedColors.find(c => c.id === color.id)) {
      setSelectedColors(selectedColors.filter(c => c.id !== color.id));
    } else {
      setSelectedColors([...selectedColors, color]);
    }
  };

  const handleSizeSelect = (size: ClothingSize | ShoeSize) => {
    if (selectedSizes.includes(size)) {
      setSelectedSizes(selectedSizes.filter(s => s !== size));
    } else {
      setSelectedSizes([...selectedSizes, size]);
    }
  };

  // Fetch Categories
  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log('🔍 Fetching categories from backend...');
        const data = await productService.getCategories();
        console.log('📦 Raw API response:', JSON.stringify(data, null, 2));

        if (data && data.categories) {
          console.log(`✅ Found ${data.categories.length} categories`);
          console.log('📋 Categories:', data.categories.map((c: any) => `${c.name} (${c.type})`).join(', '));
          setCategories(data.categories);
        } else if (Array.isArray(data)) {
          console.log(`✅ Found ${data.length} categories (array format)`);
          setCategories(data);
        } else {
          console.error('❌ Unexpected categories format:', data);
          Alert.alert('Error', 'Categories loaded but in unexpected format. Check console.');
        }
      } catch (error) {
        console.error('❌ Error fetching categories:', error);
        Alert.alert('Error', `Failed to load categories: ${error}`);
      }
    };
    fetchCategories();
  }, []);

  React.useEffect(() => {
    console.log('F-DEBUG: selectedCategory updated:', selectedCategory);
    if (selectedCategory) {
      console.log('F-DEBUG: Attributes for selected:', selectedCategory.attributes);
    }
  }, [selectedCategory]);

  // Populate data if editing
  React.useEffect(() => {
    if (editProduct && categories.length > 0) {
      setProductName(editProduct.name || '');
      setBrand(editProduct.brand || '');
      setPrice(editProduct.price?.toString() || '');
      setOriginalPrice(editProduct.compareAtPrice?.toString() || '');
      setSku(editProduct.sku || '');
      setDescription(editProduct.description || '');
      setStockQuantity(editProduct.stockQuantity?.toString() || '0');
      setCareInstructions(editProduct.careInstructions || '');
      setTryon(editProduct.tryon || false);
      setIsFeatured(editProduct.isFeatured || false);
      setTags(editProduct.tags || []);
      setThumbnail(editProduct.thumbnail?.url || null);
      setProductImages(editProduct.images?.map((img: any) => img.url) || []);

      // Dynamic Specs
      if (editProduct.specifications) {
        setSpecifications(editProduct.specifications);
      }

      // Match category
      if (editProduct.category) {
        // If getting populated, category might be populated object or ID
        const catId = typeof editProduct.category === 'object' ? editProduct.category._id : editProduct.category;
        const foundCat = categories.find(c => c._id === catId);
        if (foundCat) setSelectedCategory(foundCat);
      }
    }
  }, [editProduct, categories]);

  const handleSpecChange = (key: string, value: any) => {
    setSpecifications((prev: any) => ({
      ...prev,
      [key]: value
    }));
  };

  const handleMultiSelect = (key: string, value: string) => {
    setSpecifications((prev: any) => {
      const current = prev[key] || [];
      if (current.includes(value)) {
        return { ...prev, [key]: current.filter((item: string) => item !== value) };
      } else {
        return { ...prev, [key]: [...current, value] };
      }
    });
  };

  const handleSubmit = async () => {
    if (!productName || !selectedCategory || !price) {
      Alert.alert('Incomplete Form', 'Please fill in all required fields (Name, Category, Price)');
      return;
    }

    if (!thumbnail) {
      Alert.alert('Thumbnail Required', 'Please select a thumbnail image for the product');
      return;
    }

    setIsLoading(true);
    try {
      const productData: any = {
        name: productName,
        brand,
        price: parseFloat(price) || 0,
        compareAtPrice: parseFloat(originalPrice) || 0,
        sku,
        description,
        stockQuantity: parseInt(stockQuantity) || 0,
        careInstructions,
        tryon,
        isFeatured,
        category: selectedCategory?._id, // Send Object ID
        colors: specifications['color'] || [], // Map from specs
        sizes: specifications['size'] || [], // Map from specs
        tags,
        specifications // Send dynamic specs
      };

      console.log('F-DEBUG: Sending product save request:', { productData, thumbnail: !!thumbnail, imagesCount: productImages.length });

      if (editProduct) {
        await productService.updateProduct(editProduct._id, productData, {
          thumbnail,
          images: productImages
        });
        Alert.alert('Success', 'Product updated successfully!');
      } else {
        await productService.createProduct(productData, {
          thumbnail,
          images: productImages
        });
        Alert.alert('Success', 'Product created successfully!');
      }

      if (onSuccess) onSuccess();

      // Reset form if not editing
      if (!editProduct) {
        setProductName('');
        setThumbnail(null);
        setProductImages([]);
        setPrice('');
      }
    } catch (error: any) {
      console.log('Save product error:', error);
      Alert.alert('Error', error.message || 'Failed to save product');
    } finally {
      setIsLoading(false);
    }
  };

  const renderSectionHeader = (icon: React.ReactNode, title: string) => (
    <View style={styles.sectionHeader}>
      {icon}
      <Text style={[
        styles.sectionTitle,
        {
          color: colors.text,
          fontFamily: fonts.semiBold,
          fontSize: 16,
          marginLeft: spacing.sm,
        }
      ]}>
        {title}
      </Text>
    </View>
  );

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      showsVerticalScrollIndicator={false}
    >
      <Card style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderRadius: radius.lg,
          margin: spacing.md,
        }
      ]}>
        <Card.Content>
          {renderSectionHeader(<ImageIcon size={20} color={colors.primary} />, 'Product Images *')}

          <View style={styles.imageSelectorContainer}>
            <TouchableOpacity
              style={[styles.thumbnailPicker, { backgroundColor: colors.background, borderColor: colors.border }]}
              onPress={pickThumbnail}
            >
              {thumbnail ? (
                <Image source={{ uri: thumbnail }} style={styles.pickedImage} />
              ) : (
                <View style={styles.pickerPlaceholder}>
                  <PlusIcon size={24} color={colors.textTertiary} />
                  <Text style={[styles.pickerLabel, { color: colors.textTertiary }]}>Thumbnail</Text>
                </View>
              )}
            </TouchableOpacity>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imagesScroll}>
              {productImages.map((uri, index) => (
                <View key={index} style={[styles.imageWrapper, { borderColor: colors.border }]}>
                  <Image source={{ uri }} style={styles.pickedImage} />
                  <TouchableOpacity
                    style={[styles.removeButton, { backgroundColor: colors.error }]}
                    onPress={() => removeImage(uri)}
                  >
                    <CloseIcon size={12} color="#fff" />
                  </TouchableOpacity>
                </View>
              ))}
              {productImages.length < 6 && (
                <TouchableOpacity
                  style={[styles.imageAddButton, { backgroundColor: colors.background, borderColor: colors.border }]}
                  onPress={pickImages}
                >
                  <PlusIcon size={24} color={colors.textTertiary} />
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>

          {renderSectionHeader(<Type size={20} color={colors.primary} />, 'Basic Information')}

          <TextInput
            label="Product Name *"
            value={productName}
            onChangeText={setProductName}
            mode="outlined"
            style={[
              styles.input,
              {
                backgroundColor: colors.background,
                marginBottom: spacing.sm,
              }
            ]}
            theme={{ colors: { primary: colors.primary } }}
          />

          <TextInput
            label="Brand"
            value={brand}
            onChangeText={setBrand}
            mode="outlined"
            style={[
              styles.input,
              {
                backgroundColor: colors.background,
                marginBottom: spacing.sm,
              }
            ]}
          />

          <View style={styles.priceRow}>
            <TextInput
              label="Price *"
              value={price}
              onChangeText={setPrice}
              mode="outlined"
              keyboardType="decimal-pad"
              style={[
                styles.priceInput,
                {
                  backgroundColor: colors.background,
                  marginBottom: spacing.sm,
                }
              ]}
              left={<TextInput.Affix text="$" />}
            />
            <TextInput
              label="Original Price"
              value={originalPrice}
              onChangeText={setOriginalPrice}
              mode="outlined"
              keyboardType="decimal-pad"
              style={[
                styles.priceInput,
                {
                  backgroundColor: colors.background,
                  marginBottom: spacing.sm,
                }
              ]}
              left={<TextInput.Affix text="$" />}
            />
          </View>

          {renderSectionHeader(<Tag size={20} color={colors.primary} />, 'Category & Type')}

          {/* Dynamic Type Selector */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginBottom: spacing.md }}
            contentContainerStyle={{ gap: spacing.sm }}
          >
            {availableTypes.map((type) => {
              const isSelected = selectedType === type;
              // Simple emoji mapping for types
              const typeEmojis: any = { 'clothing': '👕', 'footwear': '👟', 'accessory': '👜', 'other': '📦' };
              const label = type.charAt(0).toUpperCase() + type.slice(1);

              return (
                <TouchableOpacity
                  key={type}
                  onPress={() => {
                    setSelectedType(type);
                    setSelectedCategory(null);
                  }}
                  style={[
                    styles.typeButton,
                    {
                      backgroundColor: isSelected ? colors.primary : colors.surface,
                      borderColor: colors.border,
                      borderRadius: radius.sm,
                      minWidth: 100,
                      paddingHorizontal: 16
                    }
                  ]}
                >
                  <Text style={[
                    styles.typeButtonText,
                    {
                      color: isSelected ? colors.background : colors.text,
                      fontFamily: isSelected ? fonts.semiBold : fonts.regular,
                    }
                  ]}>
                    {typeEmojis[type] || ''} {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Categories Grid - Dynamic */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesScroll}
          >
            {categories
              .filter(cat => cat.type === selectedType)
              .map(category => (
                <TouchableOpacity
                  key={category._id}
                  onPress={() => {
                    setSelectedCategory(category);
                    // setSpecifications({}); // Optional: clear specs on change?
                  }}
                  style={[
                    styles.categoryButton,
                    {
                      backgroundColor: selectedCategory?._id === category._id
                        ? colors.primary + '15'
                        : colors.surface,
                      borderColor: selectedCategory?._id === category._id
                        ? colors.primary
                        : colors.border,
                      borderRadius: radius.md,
                      marginRight: spacing.sm,
                    }
                  ]}
                >
                  <Text style={[
                    styles.categoryEmoji,
                    { fontSize: 24 }
                  ]}>
                    {category.icon || '📦'}
                  </Text>
                  <Text style={[
                    styles.categoryName,
                    {
                      color: selectedCategory?._id === category._id
                        ? colors.primary
                        : colors.text,
                      fontFamily: selectedCategory?._id === category._id
                        ? fonts.semiBold
                        : fonts.regular,
                      marginTop: spacing.xs,
                    }
                  ]}>
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
          </ScrollView>

          {/* Removed hardcoded Colors section */}
          {/* Removed hardcoded Sizes section */}

          {renderSectionHeader(<Hash size={20} color={colors.primary} />, 'Product Details')}

          <TextInput
            label="SKU (Stock Keeping Unit)"
            value={sku}
            onChangeText={setSku}
            mode="outlined"
            style={[
              styles.input,
              {
                backgroundColor: colors.background,
                marginBottom: spacing.sm,
              }
            ]}
          />

          <TextInput
            label="Stock Quantity *"
            value={stockQuantity}
            onChangeText={setStockQuantity}
            mode="outlined"
            keyboardType="number-pad"
            style={[
              styles.input,
              {
                backgroundColor: colors.background,
                marginBottom: spacing.sm,
              }
            ]}
            placeholder="Available quantity"
          />

          <TextInput
            label="Care Instructions"
            value={careInstructions}
            onChangeText={setCareInstructions}
            mode="outlined"
            multiline
            numberOfLines={3}
            style={[
              styles.input,
              {
                backgroundColor: colors.background,
                marginBottom: spacing.sm,
              }
            ]}
            placeholder="How to care for this product..."
          />

          {/* Try-On Toggle */}
          <TouchableOpacity
            onPress={() => setTryon(!tryon)}
            style={[
              styles.toggleContainer,
              {
                backgroundColor: tryon ? colors.primary + '10' : colors.surface,
                borderColor: tryon ? colors.primary : colors.border,
                borderRadius: radius.md,
                marginBottom: spacing.sm,
              }
            ]}
          >
            <View style={styles.toggleContent}>
              <View>
                <Text style={[styles.toggleLabel, { color: colors.text, fontFamily: fonts.semiBold }]}>
                  Virtual Try-On Available
                </Text>
                <Text style={[styles.toggleSubtext, { color: colors.textSecondary, fontFamily: fonts.regular }]}>
                  Enable AR try-on for this product
                </Text>
              </View>
              <View style={[
                styles.toggle,
                {
                  backgroundColor: tryon ? colors.primary : colors.border,
                  borderRadius: radius.full,
                }
              ]}>
                <View style={[
                  styles.toggleThumb,
                  {
                    backgroundColor: colors.background,
                    transform: [{ translateX: tryon ? 20 : 0 }],
                  }
                ]} />
              </View>
            </View>
          </TouchableOpacity>

          {/* Featured Toggle */}
          <TouchableOpacity
            onPress={() => setIsFeatured(!isFeatured)}
            style={[
              styles.toggleContainer,
              {
                backgroundColor: isFeatured ? colors.primary + '10' : colors.surface,
                borderColor: isFeatured ? colors.primary : colors.border,
                borderRadius: radius.md,
                marginBottom: spacing.md,
              }
            ]}
          >
            <View style={styles.toggleContent}>
              <View>
                <Text style={[styles.toggleLabel, { color: colors.text, fontFamily: fonts.semiBold }]}>
                  Featured Product
                </Text>
                <Text style={[styles.toggleSubtext, { color: colors.textSecondary, fontFamily: fonts.regular }]}>
                  Show this product in featured sections
                </Text>
              </View>
              <View style={[
                styles.toggle,
                {
                  backgroundColor: isFeatured ? colors.primary : colors.border,
                  borderRadius: radius.full,
                }
              ]}>
                <View style={[
                  styles.toggleThumb,
                  {
                    backgroundColor: colors.background,
                    transform: [{ translateX: isFeatured ? 20 : 0 }],
                  }
                ]} />
              </View>
            </View>
          </TouchableOpacity>

          {/* Dynamic Details - Rendered from Category Attributes */}
          {selectedCategory && selectedCategory.attributes && selectedCategory.attributes.length > 0 && (
            <>
              <View style={{ marginBottom: 16 }}>
                <Text style={{ color: colors.textSecondary, marginBottom: 8 }}>
                  {selectedCategory.name} Specifics
                </Text>
                {selectedCategory.attributes.map((attr: any) => (
                  <View key={attr.key} style={{ marginBottom: 12 }}>
                    {attr.key === 'color' || attr.key === 'size' ? (
                      // Special handling for multi-select Color/Size
                      <>
                        <Text style={{ color: colors.text, marginBottom: 4, fontFamily: fonts.medium, fontSize: 13 }}>{attr.label} *</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                          {attr.options.map((opt: string) => {
                            const isSelected = (specifications[attr.key] || []).includes(opt);
                            // Simple color mapping for UI visualization (if key is 'color')
                            const hexMap: any = { 'Black': '#000', 'White': '#FFF', 'Red': '#F00', 'Blue': '#00F', 'Green': '#0F0', 'Yellow': '#FF0', 'Gray': '#888', 'Navy': '#000080', 'Brown': '#A52A2A', 'Beige': '#F5F5DC', 'Purple': '#800080', 'Pink': '#FFC0CB', 'Orange': '#FFA500' };
                            const bgColor = attr.key === 'color' && hexMap[opt] ? hexMap[opt] : colors.surface;

                            return (
                              <TouchableOpacity
                                key={opt}
                                onPress={() => {
                                  // For color/size we want MULTI select usually?
                                  // The backend schema set them as single 'select'. 
                                  // But usually product can have multiple sizes/colors available.
                                  // Assuming we want to select ONE for this specific SKU or MULTIPLE for available variants?
                                  // Based on previous code (selectedColors array), it was MULTIPLE.
                                  // So treating as multiselect here regardless of backend type 'select' for these specific keys.
                                  handleMultiSelect(attr.key, opt)
                                }}
                                style={{
                                  backgroundColor: attr.key === 'color' ? colors.surface : (isSelected ? colors.primary : colors.surface),
                                  paddingHorizontal: 12,
                                  paddingVertical: 6,
                                  borderRadius: 20, // Pill shape
                                  borderWidth: 1,
                                  borderColor: isSelected ? colors.primary : colors.border,
                                  marginRight: 8,
                                  flexDirection: 'row',
                                  alignItems: 'center'
                                }}
                              >
                                {attr.key === 'color' && (
                                  <View style={{
                                    width: 16, height: 16, borderRadius: 8,
                                    backgroundColor: hexMap[opt] || '#ccc',
                                    marginRight: 6,
                                    borderWidth: 1, borderColor: colors.border
                                  }} />
                                )}
                                <Text style={{
                                  color: attr.key === 'color' ? colors.text : (isSelected ? colors.background : colors.text),
                                  fontSize: 12,
                                  fontWeight: isSelected ? '600' : '400'
                                }}>{opt}</Text>
                              </TouchableOpacity>
                            )
                          })}
                        </ScrollView>
                      </>
                    ) : attr.type === 'select' ? (
                      <>
                        <Text style={{ color: colors.text, marginBottom: 4, fontFamily: fonts.medium, fontSize: 13 }}>{attr.label}</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                          {attr.options.map((opt: string) => (
                            <TouchableOpacity
                              key={opt}
                              onPress={() => handleSpecChange(attr.key, opt)}
                              style={{
                                backgroundColor: specifications[attr.key] === opt ? colors.primary : colors.surface,
                                paddingHorizontal: 12,
                                paddingVertical: 6,
                                borderRadius: 16,
                                borderWidth: 1,
                                borderColor: specifications[attr.key] === opt ? colors.primary : colors.border,
                                marginRight: 8
                              }}
                            >
                              <Text style={{
                                color: specifications[attr.key] === opt ? colors.background : colors.text,
                                fontSize: 12
                              }}>{opt}</Text>
                            </TouchableOpacity>
                          ))}
                        </ScrollView>
                      </>
                    ) : attr.type === 'boolean' ? (
                      <TouchableOpacity
                        onPress={() => handleSpecChange(attr.key, !specifications[attr.key])}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          padding: 12,
                          borderWidth: 1,
                          borderColor: specifications[attr.key] ? colors.primary : colors.border,
                          borderRadius: 8,
                          backgroundColor: specifications[attr.key] ? colors.primary + '10' : 'transparent'
                        }}
                      >
                        <Text style={{ flex: 1, color: colors.text }}>{attr.label}</Text>
                        {specifications[attr.key] &&
                          <Text style={{ color: colors.primary, fontWeight: 'bold' }}>Active</Text>
                        }
                      </TouchableOpacity>
                    ) : (
                      <TextInput
                        label={attr.label}
                        value={specifications[attr.key] || ''}
                        onChangeText={(text) => handleSpecChange(attr.key, text)}
                        mode="outlined"
                        style={[styles.input, { backgroundColor: colors.background }]}
                      />
                    )}
                  </View>
                ))}
              </View>
            </>
          )}

          {renderSectionHeader(<FileText size={20} color={colors.primary} />, 'Description & Tags')}

          <TextInput
            label="Product Description"
            value={description}
            onChangeText={setDescription}
            mode="outlined"
            multiline
            numberOfLines={4}
            style={[
              styles.input,
              {
                backgroundColor: colors.background,
                marginBottom: spacing.sm,
                minHeight: 100,
              }
            ]}
          />

          <View style={styles.tagsContainer}>
            <TextInput
              label="Add Tags"
              value={tagInput}
              onChangeText={setTagInput}
              mode="outlined"
              onSubmitEditing={handleAddTag}
              style={[
                styles.input,
                {
                  backgroundColor: colors.background,
                  marginBottom: spacing.sm,
                }
              ]}
              right={<TextInput.Icon icon="plus" onPress={handleAddTag} />}
            />

            <View style={styles.tagsList}>
              {tags.map(tag => (
                <Chip
                  key={tag}
                  mode="outlined"
                  onClose={() => handleRemoveTag(tag)}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: colors.surface,
                      marginRight: spacing.xs,
                      marginBottom: spacing.xs,
                    }
                  ]}
                  textStyle={{ color: colors.text, fontFamily: fonts.regular }}
                >
                  {tag}
                </Chip>
              ))}
            </View>
          </View>

          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={isLoading}
            disabled={isLoading}
            style={[
              styles.submitButton,
              {
                backgroundColor: colors.primary,
                borderRadius: radius.lg,
                marginTop: spacing.lg,
              }
            ]}
            labelStyle={[
              styles.submitButtonText,
              {
                color: colors.background,
                fontFamily: fonts.semiBold,
                fontSize: 16,
              }
            ]}
          >
            Save Product
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  input: {
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    gap: 8,
  },
  priceInput: {
    flex: 1,
  },
  typeSelector: {
    flexDirection: 'row',
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  typeButtonText: {
    fontSize: 14,
  },
  categoriesScroll: {
    marginBottom: 16,
  },
  categoryButton: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderWidth: 1,
  },
  categoryEmoji: {
    fontSize: 24,
  },
  categoryName: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
  colorsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  colorButton: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
    borderWidth: 1,
  },
  colorSwatch: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
  },
  colorName: {
    fontSize: 11,
    marginTop: 2,
  },
  sizesScroll: {
    marginBottom: 16,
  },
  sizeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sizeText: {
    fontSize: 14,
    fontWeight: '500',
  },
  tagsContainer: {
    marginBottom: 16,
  },
  tagsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  chip: {
    marginRight: 4,
    marginBottom: 4,
  },
  submitButton: {
    paddingVertical: 12,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  imageSelectorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  thumbnailPicker: {
    width: 100,
    height: 100,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  pickedImage: {
    width: '100%',
    height: '100%',
  },
  pickerPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerLabel: {
    fontSize: 10,
    marginTop: 4,
  },
  imagesScroll: {
    flex: 1,
    height: 100,
  },
  imageWrapper: {
    width: 100,
    height: 100,
    borderRadius: 8,
    borderWidth: 1,
    marginRight: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  removeButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  imageAddButton: {
    width: 100,
    height: 100,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagChip: {
    marginRight: 8,
    marginBottom: 8,
  },
  toggleContainer: {
    padding: 16,
    borderWidth: 1,
  },
  toggleContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleLabel: {
    fontSize: 15,
    marginBottom: 4,
  },
  toggleSubtext: {
    fontSize: 12,
  },
  toggle: {
    width: 48,
    height: 28,
    padding: 2,
    justifyContent: 'center',
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
});

export default ProductMetadataForm;