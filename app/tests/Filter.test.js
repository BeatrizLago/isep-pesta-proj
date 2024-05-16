import {
  filterLocationsByAccessLevel,
  filterLocationsByCity,
  filterLocationsByCategory,
  filterLocationsByWheelchair,
} from "../Components/MyFilter"

describe("filterLocationsByAccessLevel", () => {
  test("filterLocationsByAccessLevel filters locations by access level correctly", () => {
    // Sample array of locations
    const locations = [
      { name: "Location 1", accessLevel: 3 },
      { name: "Location 2", accessLevel: 2 },
      { name: "Location 3", accessLevel: 5 },
      { name: "Location 4", accessLevel: 5 },
    ];

    // Test filtering with access level 3
    const filteredLocations = filterLocationsByAccessLevel(locations, 3);
    expect(filteredLocations).toEqual([{ name: "Location 1", accessLevel: 3 }]);

    // Test filtering with access level 5
    const filteredLocations2 = filterLocationsByAccessLevel(locations, 5);
    expect(filteredLocations2).toEqual([
      { name: "Location 3", accessLevel: 5 },
      { name: "Location 4", accessLevel: 5 },
    ]);

    // Test filtering with non-existent access level
    const filteredLocations3 = filterLocationsByAccessLevel(locations, 4);
    expect(filteredLocations3).toEqual([]);
  });
});

describe("filterLocationsByCity", () => {
  const locations = [
    { name: "Location 1", address: { city: "City A" } },
    { name: "Location 2", address: { city: "City B" } },
    { name: "Location 3", address: { city: "City A" } },
  ];

  test("filters locations by city correctly", () => {
    const filteredLocations = filterLocationsByCity(locations, "City A");
    expect(filteredLocations).toHaveLength(2);
    expect(
      filteredLocations.every((location) => location.address.city === "City A")
    ).toBe(true);
  });
});

describe("filterLocationsByCategory", () => {
  const locations = [
    { name: "Location 1", category: "Category A" },
    { name: "Location 2", category: "Category B" },
    { name: "Location 3", category: "Category A" },
  ];

  test("filters locations by category correctly", () => {
    const filteredLocations = filterLocationsByCategory(
      locations,
      "Category A"
    );
    expect(filteredLocations).toHaveLength(2);
    expect(
      filteredLocations.every((location) => location.category === "Category A")
    ).toBe(true);
  });
});

describe("filterLocationsByWheelchair", () => {
  const locations = [
    { name: "Location 1", wheelchair: { width: 30, height: 40 } },
    { name: "Location 2", wheelchair: { width: 25, height: 35 } },
    { name: "Location 3", wheelchair: { width: 35, height: 45 } },
    { name: "Location 4", wheelchair: { width: 35, height: 30 } },
  ];

  test("filters locations by wheelchair dimensions correctly", () => {
    const wheelchair = { width: 30, height: 35 };
    const filteredLocations = filterLocationsByWheelchair(
      locations,
      wheelchair
    );
    expect(filteredLocations).toHaveLength(2);
    expect(
      filteredLocations.every((location) => {
        return (
          wheelchair.width <= location.wheelchair.width &&
          wheelchair.height <= location.wheelchair.height
        );
      })
    ).toBe(true);
  });
});
