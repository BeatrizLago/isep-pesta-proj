import React, { useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  FlatList,
  StyleSheet,
} from "react-native";
import { SelectList } from "react-native-dropdown-select-list";

const MyFilter = ({
  data,
  filters,
  cities,
  categories,
  selectedFilters,
  setFilteredData,
  onFilterChange,
}) => {
  const handleFilterButtonClick = (selectedLevel, type) => {
    const isCity = type === "cidade";
    const isCategory = type === "categoria";

    const otherFilters = selectedFilters.filter(
      (filter) =>
        !(isCity ? cities : isCategory ? categories : []).includes(filter)
    );

    const newFilters =
      isCity || isCategory
        ? [...otherFilters, selectedLevel]
        : selectedFilters.includes(selectedLevel)
        ? selectedFilters.filter((el) => el !== selectedLevel)
        : [...selectedFilters, selectedLevel];

    onFilterChange(newFilters);
  };

  const isFilterSelected = (filter) => selectedFilters.includes(filter);

  useEffect(() => {
    const filteredData = selectedFilters.length
      ? data.filter((item) => {
          const match = (filters, key) => {
            const value = key
              .split(".")
              .reduce((acc, part) => acc && acc[part], item);
            return filters.length ? filters.includes(value?.toString()) : true;
          };

          return (
            match(
              selectedFilters.filter((f) => filters.includes(f)),
              "accessLevel"
            ) &&
            match(
              selectedFilters.filter((f) => cities.includes(f)),
              "address.city"
            ) &&
            match(
              selectedFilters.filter((f) => categories.includes(f)),
              "category"
            )
          );
        })
      : data;

    setFilteredData(filteredData);
  }, [selectedFilters, data]);

  const generateOptions = (items) => [
    { key: "none", value: "Nenhum" },
    ...items.map((item) => ({ key: item, value: item })),
  ];

  return (
    <View>
      <View style={styles.container}>
        <FlatList
          data={filters}
          horizontal
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleFilterButtonClick(item, "filter")}
              style={[
                styles.filterButton,
                isFilterSelected(item) && styles.selectedFilterButton,
              ]}
            >
              <Text
                style={
                  isFilterSelected(item) ? styles.selectedFilterText : null
                }
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
      {["Cidade", "Categoria"].map((label) => (
        <View key={label} style={styles.pickerContainer}>
          <Text style={styles.label}>Selecione {label}:</Text>
          <SelectList
            setSelected={(value) =>
              handleFilterButtonClick(value, label.toLowerCase())
            }
            data={generateOptions(label === "Cidade" ? cities : categories)}
            placeholder={`Selecione uma ${label.toLowerCase()}`}
            boxStyles={pickerSelectStyles.box}
            dropdownStyles={pickerSelectStyles.dropdown}
          />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    marginBottom: 10,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    marginHorizontal: 5,
  },
  selectedFilterButton: {
    backgroundColor: "#007bff",
  },
  selectedFilterText: {
    color: "#fff",
  },
  pickerContainer: {
    marginHorizontal: 10,
    marginBottom: 10,
  },
  label: {
    marginBottom: 5,
    fontSize: 16,
    fontWeight: "bold",
  },
});

const pickerSelectStyles = StyleSheet.create({
  box: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
  },
});

export default MyFilter;
