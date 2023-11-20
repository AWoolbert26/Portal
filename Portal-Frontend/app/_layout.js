import * as SplashScreen from 'expo-splash-screen';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Stack } from "expo-router";
import { View, Animated, Easing, StyleSheet } from 'react-native';
import { AuthProvider } from "./auth/AuthContext";
import * as eva from '@eva-design/eva';
import { ApplicationProvider } from "@ui-kitten/components"

export default function Layout() {  
  return (
    <AuthProvider>
        <ApplicationProvider {...eva} theme={eva.light}>
        <Stack
          screenOptions={{
            headerTintColor: "black",
            headerStyle: { backgroundColor: "white" },
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        />
        </ApplicationProvider>
    </AuthProvider>
  );
}