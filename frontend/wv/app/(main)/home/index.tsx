// app/(main)/home/index.tsx
import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { HomeHeader } from "./components/HomeHeader";
import { HeroBanner } from "./components/HeroBanner";
import { CategoryRail } from "./components/CategoryRail";
import { ProductGrid } from "./components/ProductGrid";

import { useTheme } from "@/src/context/ThemeContext";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { appTheme, isDark } = useTheme();
  const colors = appTheme.colors;

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <StatusBar style={isDark ? "light" : "dark"} />

      <HomeHeader insets={insets} />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Modular Components */}
        <HeroBanner />
        <CategoryRail />
        <ProductGrid />

        {/* Bottom Spacer */}
        <View style={{ height: 80 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
});
