import React, { useState, useRef } from "react";
import { View, Image, ScrollView, Dimensions, StyleSheet } from "react-native";

const ImageCarousel = ({ images }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef(null);
  const deviceWidth = Dimensions.get("window").width;

  const handleScroll = (event) => {
    const contentOffset = event.nativeEvent.contentOffset;
    const imageIndex = Math.floor(contentOffset.x / deviceWidth);
    setActiveIndex(imageIndex);
  };

  const scrollToIndex = (index) => {
    if (scrollViewRef.current) {
      const xOffset = index * deviceWidth;
      scrollViewRef.current.scrollTo({ x: xOffset, animated: true });
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
      >
        {images.map((image, index) => (
          <Image key={index} source={{ uri: image }} style={styles.image} />
        ))}
      </ScrollView>
      <View style={styles.pagination}>
        {images.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              activeIndex === index && styles.activeDot,
            ]}
            onTouchEnd={() => scrollToIndex(index)}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: Dimensions.get("window").width,
    height: 200,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 10,
    width: "100%",
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    margin: 5,
    backgroundColor: "gray",
  },
  activeDot: {
    backgroundColor: "#00bcd4",
  },
});

export default ImageCarousel;
