import {View,Text} from"react-native";
export function Card({ children }:{children:React.ReactNode}) {
    return(
        <View
        style={{
            padding:16,
            borderRadius:8,
            backgroundColor:"#fff",
            shadowColor:"#000",
            shadowOpacity:0.1,
            shadowRadius:4,
            elevation:3,
        }}
        >
            {children}
        </View>
    );
}
