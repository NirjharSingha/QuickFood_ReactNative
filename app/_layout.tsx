import { Stack } from "expo-router/stack";
import React from "react";
import { NativeWindStyleSheet } from "nativewind";
import Header from "@/components/Header";
import { usePathname } from "expo-router";
import { styled } from 'nativewind';
import { View } from 'react-native';

NativeWindStyleSheet.setOutput({
  default: "native",
});

export default function Layout() {
  const pathname = usePathname();
  const StyledView = styled(View);

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{
        headerShown: pathname === '/', header: () =>
          <StyledView className="bg-[#D6C5B7] px-2 py-1 flex-row justify-between items-center w-full">
            <Header />
          </StyledView>
      }} />
      < Stack.Screen name="+not-found" />
    </Stack >
  );
}

