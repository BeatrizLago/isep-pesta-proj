import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Styles } from "./MyFilterButton.style";

const MyFilterButtons = ({toggleFilter, clearFilters, showFilter}) => {

  return (
    <View style={Styles.bottomBarHeader}>
      <TouchableOpacity
        style={Styles.bottomBarItem}
        onPress={() => toggleFilter()}
      >
        <View>
          <Text style={Styles.filterText}>
            {showFilter ? "Fechar Filtros" : "Abrir Filtros"}
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={Styles.bottomBarItem1} onPress={clearFilters}>
        <View>
          <Text style={Styles.clearFilterText}>Limpar Filtros</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default MyFilterButtons;
