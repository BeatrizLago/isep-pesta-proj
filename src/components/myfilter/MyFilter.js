import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  FlatList,
  Switch,
  ScrollView,
} from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import { Styles } from "./MyFilter.styles";
import Collapsible from "react-native-collapsible";

const MyFilter = ({
  showFilter,
  data,
  selectedFilters,
  setFilteredData,
  onFilterChange,
  user,
  t,
}) => {
  const [userWheelChair, setUserWheelChair] = useState(null);
  const [wheelchairFilterEnabled, setWheelchairFilterEnabled] = useState(false);

  const filters = ["0", "1", "2", "3", "4", "5"];
  const accessibility = [
    { key: "parking", label: t("components.myFilters.parking") },
    { key: "entrance", label: t("components.myFilters.entrance") },
    {
      key: "handicapBathroom",
      label: t("components.myFilters.handicapBathroom"),
    },
    {
      key: "internalCirculation",
      label: t("components.myFilters.internalCirculation"),
    },
    {
      key: "signLanguage",
      label: t("components.myFilters.signLanguage"),
    },
    {
      key: "visualAlarms",
      label: t("components.myFilters.visualAlarms"),
    },
    {
      key: "writtenDescriptions",
      label: t("components.myFilters.writtenDescriptions"),
    },
  ];
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
      if (user) {
        setUserWheelChair(user.wheelchair);
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

          const matchesAccessibility = accessibility.every((accFilter) => {
            return selectedFilters.includes(accFilter.key)
              ? item.accessibility[accFilter.key] === true
              : true;
          });

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
            matchesWheelchair &&
            matchesAccessibility
          );
        })
      : data.filter((item) => {
          const matchesWheelchair =
            !wheelchairFilterEnabled ||
            (userWheelChair &&
              item.wheelchair &&
              userWheelChair.height <= item.wheelchair.height &&
              userWheelChair.width <= item.wheelchair.width);

          const matchesAccessibility = accessibility.every((accFilter) => {
            return selectedFilters.includes(accFilter.key)
              ? item.accessibility[accFilter.key] === true
              : true;
          });

          return matchesWheelchair && matchesAccessibility;
        });

    setFilteredData(filteredData);
  }, [selectedFilters, data, wheelchairFilterEnabled, userWheelChair]);

  const generateOptions = (items) => [
    { key: "none", value: t("components.myFilters.notFound") },
    ...items.map((item) => ({ key: item, value: item })),
  ];

  const RadioButton = ({ label, selected, onPress }) => (
    <TouchableOpacity onPress={onPress} style={Styles.radioButton}>
      <View
        style={[Styles.radioCircle, selected && Styles.selectedRadioCircle]}
      >
        {selected && <View style={Styles.selectedInnerCircle} />}
      </View>
      <Text style={selected ? Styles.selectedFilterText : Styles.filterText}>
        {label}
      </Text>
    </TouchableOpacity>
  );
  return showFilter ? (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <Text style={Styles.label}>
        {t("components.myFilters.accessibility")}
      </Text>
      <View style={Styles.containerAccess}>
        {accessibility.map((item) => (
          <RadioButton
            key={item.key}
            label={item.label}
            selected={isFilterSelected(item.key)}
            onPress={() => handleFilterButtonClick(item.key, "filter")}
          />
        ))}
      </View>
      <View style={Styles.divider} />
      <Text style={Styles.label}>{t("components.myFilters.category")}</Text>
      <View style={Styles.containerAccess}>
        {categories.map((item) => (
          <RadioButton
            key={item}
            label={item}
            selected={isFilterSelected(item)}
            onPress={() => handleFilterButtonClick(item, "filter")}
          />
        ))}
      </View>
      <View style={Styles.divider} />
      {["Cidade"].map((label) => (
        <View key={label} style={Styles.pickerContainer}>
          <SelectList
            setSelected={(value) =>
              handleFilterButtonClick(value, label.toLowerCase())
            }
            data={generateOptions(label === "Cidade" ? cities : categories)}
            placeholder={t("components.myFilters.city")}
            boxStyles={Styles.box}
            dropdownStyles={Styles.dropdown}
          />
        </View>
      ))}
      <View style={Styles.divider} />
      {userWheelChair && userWheelChair.height && userWheelChair.width && (
        <View style={Styles.switchContainer}>
          <Text style={Styles.label}>
            {t("components.myFilters.wheelchair")}
          </Text>
          <Switch
            value={wheelchairFilterEnabled}
            onValueChange={setWheelchairFilterEnabled}
          />
        </View>
      )}
    </ScrollView>
  ) : null;
};

export default MyFilter;
