const { filterLocationsByAccessLevel } = require('../Components/Filter');

test('filterLocationsByAccessLevel filters locations by access level correctly', () => {
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
  expect(filteredLocations2).toEqual([{ name: "Location 3", accessLevel: 5 }, { name: "Location 4", accessLevel: 5 },]);

  // Test filtering with non-existent access level
  const filteredLocations3 = filterLocationsByAccessLevel(locations, 4);
  expect(filteredLocations3).toEqual([]);
});
