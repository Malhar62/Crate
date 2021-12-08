import axios from "axios"
import { Alert } from "react-native"
import { FETCH_SUCCEDED, FETCH_FAILED, FETCH_NEWS, EDIT, TICK, DELETETICKED } from "../Constants"
import { add } from "./extra"

export const fetchSucessAction = (recievedPosts) => ({ type: FETCH_SUCCEDED, recievedPosts })
export const fetchFailedAction = (error) => ({ type: FETCH_FAILED, error })
export const edit = (obj) => {
  return (dispatch) => {
    dispatch({
      type: EDIT,
      payload: obj
    })
  }
}
export const double = (data, callback) => {
  return (dispatch) => {
    dispatch(add({ text: data, time: "15:15" }))
    callback()
  }
}
export const ticker = (datalist) => {
  return (dispatch) => {
    dispatch({ type: TICK, payload: datalist })
  }
}
export const deleteTicked = () => {
  return (dispatch) => {
    dispatch({ type: DELETETICKED })
  }
}
/**
 *  WebServices.getApiCall(
      EndPoint.crate.getCatchAllCrate,
      ``,
      (success: any) => {
        const {data, statusCode} = success.data;
        if (statusCode === Common.statusCode.success && data) {
          const {crate_id, crate_name, total_items} = data[0];
          dispatch({
            type: ActionType.CATCH_ALL_SUCCESSS,
            payload: {catchAllCrateId: crate_id, catchAllCrateName: crate_name},
          });
          // dispatch({
          //   type: ActionType.UPDATE_CRATE_COUNTS,
          //   payload: {catchAllCount: total_items},
          // });
        }
      },
      (fail: any) => {
        // WebServices.handleApiError(fail);
      },
    );
 */