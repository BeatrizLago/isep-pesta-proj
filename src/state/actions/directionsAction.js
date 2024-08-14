import { openRouteService } from "../../services/openRoute/openRouteConfig";

export const fetchDirections = (coordinates) => async (dispatch) => {
  try {
    const response = await openRouteService.post("/v2/directions/driving-car", {
      coordinates: coordinates,
    });
    
    dispatch({ type: "GET_DIRECTIONS_SUCCESS", payload: response.data });
  } catch (error) {
    dispatch({ type: "GET_DIRECTIONS_FAILURE", payload: error.message });
  }
};
