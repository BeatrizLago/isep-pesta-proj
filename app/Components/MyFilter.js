import React, { useEffect, useMemo, useState } from "react";
import { View, TouchableOpacity, Text, FlatList, Switch } from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import { FIREBASE_AUTH } from "../config/Firebase.config";
import { fetchUserFromFirestore } from "../config/Firestore";
import { MyFilterSytle, MyFilterPickerSelectStyles } from "./Styles";

const MyFilter = ({
  data,
  selectedFilters,
  setFilteredData,
  onFilterChange,
}) => {
  const [userWheelChair, setUserWheelChair] = useState(null);
  const [wheelchairFilterEnabled, setWheelchairFilterEnabled] = useState(false);

  const filters = ["0", "1", "2", "3", "4", "5"];
  const categories = useMemo(
    () => [...new Set(data.map((item) => item.category))],
    [data]
  );
  const cities = useMemo(
    () => [...new Set(data.map((item) => item.address.city))],
    [data]
  );
  const wheelchairData = useMemo(
    () => [...new Set(data.map((item) => item.wheelchair))],
    [data]
  );

  const fetchUserData = async () => {
    try {
      const currentUser = FIREBASE_AUTH.currentUser;
      if (currentUser) {
        const userData = await fetchUserFromFirestore(currentUser.uid);
        setUserWheelChair(userData.wheelchair);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

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

          const matchesWheelchair =
            !wheelchairFilterEnabled ||
            (userWheelChair &&
              item.wheelchair &&
              userWheelChair.height <= item.wheelchair.height &&
              userWheelChair.width <= item.wheelchair.width);

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
            ) &&
            matchesWheelchair
          );
        })
      : data.filter((item) => {
          const matchesWheelchair =
            !wheelchairFilterEnabled ||
            (userWheelChair &&
              item.wheelchair &&
              userWheelChair.height <= item.wheelchair.height &&
              userWheelChair.width <= item.wheelchair.width);

          return matchesWheelchair;
        });

    setFilteredData(filteredData);
  }, [selectedFilters, data, wheelchairFilterEnabled, userWheelChair]);

  const generateOptions = (items) => [
    { key: "none", value: "Nenhum" },
    ...items.map((item) => ({ key: item, value: item })),
  ];

  return (
    <View>
      <View style={MyFilterSytle.container}>
        <FlatList
          data={filters}
          horizontal
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleFilterButtonClick(item, "filter")}
              style={[
                MyFilterSytle.filterButton,
                isFilterSelected(item) && MyFilterSytle.selectedFilterButton,
              ]}
            >
              <Text
                style={
                  isFilterSelected(item)
                    ? MyFilterSytle.selectedFilterText
                    : null
                }
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
      {["Cidade", "Categoria"].map((label) => (
        <View key={label} style={MyFilterSytle.pickerContainer}>
          <Text style={MyFilterSytle.label}>Selecione {label}:</Text>
          <SelectList
            setSelected={(value) =>
              handleFilterButtonClick(value, label.toLowerCase())
            }
            data={generateOptions(label === "Cidade" ? cities : categories)}
            placeholder={`Selecione uma ${label.toLowerCase()}`}
            boxStyles={MyFilterPickerSelectStyles.box}
            dropdownStyles={MyFilterPickerSelectStyles.dropdown}
          />
        </View>
      ))}
      {userWheelChair && userWheelChair.height && userWheelChair.width && (
        <View style={MyFilterSytle.switchContainer}>
          <Text style={MyFilterSytle.label}>
            Filtrar por compatibilidade com cadeira de rodas
          </Text>
          <Switch
            value={wheelchairFilterEnabled}
            onValueChange={setWheelchairFilterEnabled}
          />
        </View>
      )}
    </View>
  );
};

export default MyFilter;
