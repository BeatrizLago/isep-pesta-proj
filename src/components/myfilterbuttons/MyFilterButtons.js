import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Styles } from "./MyFilterButton.style";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


const MyFilterButtons = ({toggleFilter, clearFilters, showFilter, t}) => {

  return (
    <View style={Styles.bottomBarHeader}>
      <TouchableOpacity
        style={Styles.bottomBarItem}
        onPress={() => toggleFilter()}
      >
        <View style={Styles.buttonContainer}>
          <MaterialCommunityIcons name="tag-multiple" size={25}/>
          <Text style={Styles.filterText}>
            {showFilter ? t("components.myFiltersButtons.close") : t("components.myFiltersButtons.open")}
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={Styles.bottomBarItem1} onPress={clearFilters}>
        <View style = {Styles.buttonContainer}>
          <MaterialCommunityIcons name="tag-remove" size={23}/>
          <Text style={Styles.clearFilterText}>{t("components.myFiltersButtons.reset")}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default MyFilterButtons;
