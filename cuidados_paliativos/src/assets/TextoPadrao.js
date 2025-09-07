import { Text } from "react-native";

export default function TextoPadrao({children, style, ...rest}) {
    return (
        <Text style={[{ fontFamily: 'Comfortaa_400Regular' }, style]} {...rest}>
            {children}
        </Text>
    )
}

// Ignorar esse componente, ainda estou descobrindo como posso deixar mais fácil aplicar a fonte -Luiza