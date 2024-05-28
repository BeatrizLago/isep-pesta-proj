import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import List from '../path/to/List';
import { fetchLocations } from '../../state/actions/locationAction';

jest.mock('../../state/actions/locationAction');

const mockStore = configureStore([]);
const mockData = [{ id: 1, name: 'Location 1' }, { id: 2, name: 'Location 2' }];

describe('List Component', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      location: { locations: [] },
      user: { userInfo: { id: 1, name: 'User 1' } }
    });

    fetchLocations.mockImplementation(() => ({
      type: 'FETCH_LOCATIONS',
      payload: mockData,
    }));
  });

  test('renders correctly', () => {
    const tree = renderer.create(
      <Provider store={store}>
        <List />
      </Provider>
    ).toJSON();
    
    expect(tree).toMatchSnapshot();
  });

  test('displays loader when loading', async () => {
    let component;
    await act(async () => {
      component = renderer.create(
        <Provider store={store}>
          <List />
        </Provider>
      );
    });
    
    const loader = component.root.findByProps({ testID: 'activity-loader' });
    expect(loader).toBeTruthy();
  });

  test('fetches locations on mount', async () => {
    await act(async () => {
      renderer.create(
        <Provider store={store}>
          <List />
        </Provider>
      );
    });

    expect(fetchLocations).toHaveBeenCalled();
  });

  test('displays filter component when filter is toggled', async () => {
    let component;
    await act(async () => {
      component = renderer.create(
        <Provider store={store}>
          <List />
        </Provider>
      );
    });

    const button = component.root.findByProps({ children: 'Open Filter' }).parent;
    act(() => button.props.onPress());

    const filterComponent = component.root.findByProps({ testID: 'my-filter' });
    expect(filterComponent).toBeTruthy();
  });

  test('refresh button triggers data re-fetch', async () => {
    let component;
    await act(async () => {
      component = renderer.create(
        <Provider store={store}>
          <List />
        </Provider>
      );
    });

    const button = component.root.findByProps({ children: 'Refresh' }).parent;
    await act(async () => button.props.onPress());

    expect(fetchLocations).toHaveBeenCalledTimes(2); // once on mount, once on refresh
  });

  test('clear filters resets the data', async () => {
    store = mockStore({
      location: { locations: mockData },
      user: { userInfo: { id: 1, name: 'User 1' } }
    });

    let component;
    await act(async () => {
      component = renderer.create(
        <Provider store={store}>
          <List />
        </Provider>
      );
    });

    const button = component.root.findByProps({ children: 'Clear Filters' }).parent;
    act(() => button.props.onPress());

    const flatList = component.root.findByProps({ testID: 'flat-list' });
    expect(flatList.props.data).toHaveLength(mockData.length);
  });
});
