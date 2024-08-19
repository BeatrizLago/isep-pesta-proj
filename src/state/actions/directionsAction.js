import { openRouteService } from "../../services/openRoute/openRouteConfig";

export const fetchDirections = (coordinates, profile) => async (dispatch) => {
  try {
    const response = await openRouteService.post("/v2/directions/" + profile, {
      coordinates: coordinates,
    });

    dispatch({ type: "GET_DIRECTIONS_SUCCESS", payload: response.data });
  } catch (error) {
    dispatch({ type: "GET_DIRECTIONS_FAILURE", payload: error.message });
  }
};

export const clearDirections = () => async (dispatch) => {
  try {
    dispatch({ type: "CLEAR_DIRECTIONS_SUCCESS" });
  } catch (error) {
    dispatch({ type: "CLEAR_DIRECTIONS_FAILURE", payload: error.message });
  }
};
