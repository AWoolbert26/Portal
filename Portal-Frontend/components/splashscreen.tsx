import React from "react"
import LottieView from "lottie-react-native"

export default function Splash() {
    return (
        <LottieView autoPlay loop source={require('../assets/loading.json')}/>
    )
}