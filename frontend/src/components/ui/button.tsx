import React from"react";
import { TouchableOpacity,Text } from "react-native";

interface ButtonProps{
    onPress:() => void;
    children:React.ReactNode;
    className?:string;
}

const Button:React.FC<ButtonProps> = ({onPress,children})=>{
    return (
        <TouchableOpacity
        onPress={onPress}
        style={{
            backgroundColor:"#4F46E5", // Tailwind "indigo-600"
            paddingVertical:10,
            paddingHorizontal:16,
            borderRadius:8,
            alignItems:"center",
            marginBottom:8,
        }}
        >
            <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
        {children}
      </Text>
        </TouchableOpacity>
    );
};

export default Button;