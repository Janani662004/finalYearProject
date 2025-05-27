import React from "react";
import { View, ViewProps } from "react-native";
import clsx from "clsx";

type CardProps = {
  children: React.ReactNode;
  className?: string;
} & ViewProps;

export const Card: React.FC<CardProps> = ({ children, className, ...rest }) => {
  return (
    <View className={clsx("rounded-xl bg-white shadow-md", className)} {...rest}>
      {children}
    </View>
  );
};
